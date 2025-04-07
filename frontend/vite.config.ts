import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // render.yaml用の設定
  server: {
    allowedHosts: [process.env.FRONTEND_URL]
  }
});
