import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src/index.ts"),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
  server: {
    // 百度 `reverse_geocoding/v3` 鉴权失败时返回裸 JSON，浏览器 JSONP 无法执行；
    // 同域 fetch 可解析 body，供 MapLocationSelection 的 `bmapReverseGeocodingProxy` 使用。
    proxy: {
      "/api/bmap-rgeo": {
        target: "https://api.map.baidu.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/bmap-rgeo/, "/reverse_geocoding/v3"),
      },
    },
  },
});
