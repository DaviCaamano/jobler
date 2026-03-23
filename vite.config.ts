import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        menu: resolve(__dirname, "menu.html"),
        background: resolve(__dirname, "src/backgrounds/background.ts"),
        content: resolve(__dirname, "src/contents/content.ts")
      },
      output: {
        entryFileNames: "[name].js"
      }
    }
  }
});
