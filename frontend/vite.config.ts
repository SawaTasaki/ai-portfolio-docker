import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // render.yaml用の設定
  server: {
    allowedHosts: [import.meta.env.VITE_FRONTEND_URL],
  }
});
