import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      host: process.env.VITE_HOST || "0.0.0.0",
      port: parseInt(process.env.VITE_PORT || "5173"),
    },
    plugins: [react()],
  });
};
