import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),        // maps '@' to 'client/src'
      "@shared": path.resolve(__dirname, "shared"),          // maps '@shared' to 'shared'
      "@assets": path.resolve(__dirname, "attached_assets"), // if you have this folder in root
    },
  },
  root: path.resolve(__dirname, "client"),                  // vite root is 'client' folder
  build: {
    outDir: path.resolve(__dirname, "dist/public"),         // output to 'dist/public' at root
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',                      // proxy API calls to backend
    },
  },
});
