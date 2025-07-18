import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  resolve: {
    alias: {
      "@": resolve(__dirname, "../src"),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}', // Prevents other process.env usages from breaking in browser
  },
  build: {
    lib: {
      entry: resolve(__dirname, "index.tsx"),
      name: "ChatWidget",
      fileName: "chat-widget",
      formats: ["iife"],
    },
    outDir: resolve(__dirname, "../public/widget-dist", "/usr/local/static-server/public/chat/"),
    rollupOptions: {
      external: [],
    },
    emptyOutDir: true,
  },
  plugins: [react()],
});
