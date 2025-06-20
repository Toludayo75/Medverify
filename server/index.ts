import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Create HTTP server here
  const httpServer = createServer(app);

  // WebSocket server on the same HTTP server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const adminClients: WebSocket[] = [];

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'auth' && data.role === 'admin') {
          console.log('Admin connected to WebSocket');
          adminClients.push(ws);

          ws.send(JSON.stringify({
            type: 'auth_success',
            message: 'Admin authentication successful'
          }));

          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'verification',
                title: 'Recent Drug Verification',
                message: 'A user verified Paracetamol with NAFDAC Number A11-0591',
                timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
                status: 'genuine',
                nafdacNumber: 'A11-0591',
                productName: 'Paracetamol'
              }));
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      const index = adminClients.indexOf(ws);
      if (index !== -1) {
        adminClients.splice(index, 1);
        console.log('Admin client disconnected');
      }
    });
  });

  function notifyAdmins(notification: any) {
    const message = JSON.stringify(notification);
    adminClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Patch storage methods to notify admins on createVerification
  const originalCreateVerification = storage.createVerification;
  storage.createVerification = async (verification) => {
    const result = await originalCreateVerification(verification);
    const drug = await storage.getDrug(verification.drugId);

    if (drug) {
      notifyAdmins({
        type: 'verification',
        title: 'New Drug Verification',
        message: `NAFDAC #${drug.nafdacNumber} (${drug.productName}) was verified`,
        timestamp: new Date().toISOString(),
        status: verification.status,
        nafdacNumber: drug.nafdacNumber,
        productName: drug.productName
      });
    }

    return result;
  };

  // Patch createReport to notify admins
  const originalCreateReport = storage.createReport;
  storage.createReport = async (report) => {
    const result = await originalCreateReport(report);

    let drugDetails = '';
    if (report.drugId) {
      try {
        const drug = await storage.getDrug(report.drugId);
        if (drug) {
          drugDetails = ` for ${drug.productName} (NAFDAC #${drug.nafdacNumber})`;
        }
      } catch {
        // ignore error
      }
    }

    notifyAdmins({
      type: 'report',
      title: 'New Drug Report Submitted',
      message: `A user reported suspicious activity${drugDetails}`,
      timestamp: new Date().toISOString(),
      nafdacNumber: report.nafdacNumber,
      productName: report.productName,
      status: 'pending'
    });

    return result;
  };

  // Patch updateReport to notify admins when status changes
  const originalUpdateReport = storage.updateReport;
  storage.updateReport = async (id, reportUpdate) => {
    const originalReport = await storage.getReportById(id);
    const result = await originalUpdateReport(id, reportUpdate);

    if (originalReport && reportUpdate.status && originalReport.status !== reportUpdate.status) {
      notifyAdmins({
        type: 'report',
        title: 'Report Status Updated',
        message: `Report #${id} status changed from "${originalReport.status}" to "${reportUpdate.status}"`,
        timestamp: new Date().toISOString(),
        nafdacNumber: originalReport.nafdacNumber,
        productName: originalReport.productName,
        status: reportUpdate.status
      });
    }

    return result;
  };

  // Vite setup or static serve
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT) || 3000;

  httpServer.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
