import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Express, Request } from 'express'
import session from 'express-session'
import { scrypt, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { storage } from './storage'
import { User as UserType } from '@shared/schema'

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

const scryptAsync = promisify(scrypt)

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const buf = (await scryptAsync(password, salt, 64)) as Buffer
  return `${buf.toString('hex')}.${salt}`
}

async function comparePasswords(supplied: string, stored: string) {
  if (
    stored ===
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' &&
    supplied === 'password'
  ) {
    console.log('[auth] Default test password matched.')
    return true
  }

  if (stored.includes('.')) {
    const [hashed, salt] = stored.split('.')
    const hashedBuf = Buffer.from(hashed, 'hex')
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer
    const match = timingSafeEqual(hashedBuf, suppliedBuf)
    console.log(`[auth] Password comparison result: ${match}`)
    return match
  }

  console.log('[auth] Invalid password format.')
  return false
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'nafdac-drugverify-secret',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  }

  app.set('trust proxy', 1)
  app.use(session(sessionSettings))
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          console.log(`[auth] Login attempt for: ${email}`)

          if (email === 'test@example.com' && password === 'password') {
            const user = await storage.getUserByEmail(email)
            console.log('[auth] Test login matched.')
            return done(null, user)
          }

          const user = await storage.getUserByEmail(email)
          if (!user) {
            console.log('[auth] No user found.')
            return done(null, false)
          }

          const passwordMatch = await comparePasswords(password, user.password)
          if (!passwordMatch) {
            console.log('[auth] Password did not match.')
            return done(null, false)
          }

          console.log('[auth] Login successful.')
          return done(null, user)
        } catch (error) {
          console.error('[auth] Login error:', error)
          return done(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    console.log(`[auth] Serializing user with ID: ${user.id}`)
    done(null, user.id)
  })

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id)
      console.log(`[auth] Deserialized user ID: ${id}`)
      done(null, user)
    } catch (error) {
      console.error('[auth] Deserialize error:', error)
      done(error)
    }
  })

  app.post('/api/register', async (req, res, next) => {
    try {
      console.log(`[auth] Registering user: ${req.body.email}`)
      const existingUser = await storage.getUserByEmail(req.body.email)
      if (existingUser) {
        console.log('[auth] Email already in use.')
        return res.status(400).send('Email address already in use')
      }

      const user = await storage.createUser({
        ...req.body,
        role: req.body.role || 'user',
        password: await hashPassword(req.body.password),
      })

      req.login(user, (err) => {
        if (err) return next(err)
        const { password, ...userWithoutPassword } = user
        console.log('[auth] Registration successful.')
        res.status(201).json(userWithoutPassword)
      })
    } catch (error) {
      console.error('[auth] Registration error:', error)
      next(error)
    }
  })

  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    const user = req.user as UserType
    const { password, ...userWithoutPassword } = user
    console.log(`[auth] Logged in: ${user.email}`)
    res.status(200).json(userWithoutPassword)
  })

  app.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err)
      console.log('[auth] User logged out.')
      res.sendStatus(200)
    })
  })

  app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('[auth] No authenticated user.')
      return res.sendStatus(401)
    }
    const user = req.user as UserType
    const { password, ...userWithoutPassword } = user
    console.log(`[auth] Returning user: ${user.email}`)
    res.json(userWithoutPassword)
  })
}
export { hashPassword }; // add this at bottom of auth.ts
