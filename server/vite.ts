import express, { Express } from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ✅ Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = "express") {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: path.resolve(__dirname, "../client"),
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "../client/index.html"),
        "utf-8"
      );

      template = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const staticPath = path.resolve(__dirname, "../client/dist");

  app.use(express.static(staticPath));

  app.use("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}
