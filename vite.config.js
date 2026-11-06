import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "localhost", // LAN에서 확인할 때만 npm run dev -- --host 0.0.0.0
    open: true,
    strictPort: false,
  },
});
