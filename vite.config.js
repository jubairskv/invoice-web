import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["react-pdf", "pdfjs-dist"],
  },
  define: {
    global: "globalThis",
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  base: "/invoice-web/",
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
});
