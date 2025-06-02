import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../shared/schema.js";

export const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'ayo',
  password: process.env.DB_PASSWORD || '#Ayomide2005',
  database: process.env.DB_NAME || 'med_verify',
  port: parseInt(process.env.DB_PORT || '3306'),
});

export const db = drizzle(connection, { schema, mode: 'default' });