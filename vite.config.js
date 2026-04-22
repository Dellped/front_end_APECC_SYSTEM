import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
    base: "/front_end_APECC_SYSTEM/",
  server: {
    port: 5175, // Fixed port for consistent Google OAuth configuration
    strictPort: false, // Allow fallback if port is already in use
  },
});

