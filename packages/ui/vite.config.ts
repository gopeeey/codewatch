import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@ui": "/src/ui",
      "@assets": "/src/assets",
      "@hooks": "/src/hooks",
      "@lib": "/src/lib",
    },
  },
});
