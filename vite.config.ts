  // vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: "dist", // ✅ relative to client/
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "hooks": path.resolve(__dirname, "client/src/hooks"),
      "@shared": path.resolve(__dirname, "shared"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  
  server: {
    allowedHosts: ["medverify.onrender.com"],
  },
});
