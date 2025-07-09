import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'
import path from "path";

export default defineConfig({
  root: './src',
  plugins: [vue(), tailwindcss()],
  // 配置别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
  },
      server: {
      host: "0.0.0.0",
      port: 32001,
      open: true,
      proxy: {
        // 代理 /dev-api 的请求
        "/agent": {
          changeOrigin: true,
          // 代理目标地址：https://api.youlai.tech
          target: "https://crm.beautyedutech.com",
          rewrite: (path) => path.replace(new RegExp("^" + "/agent"), ""),
        },
      },
    },
});
