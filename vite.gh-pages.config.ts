import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist-gh-pages",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "single.html",
      },
    },
  },
});
