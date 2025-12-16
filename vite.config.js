import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Fixed port for consistent Google OAuth configuration
    strictPort: true, // Exit if port is already in use (prevents port changes)
  },
});
