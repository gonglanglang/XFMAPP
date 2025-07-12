// vite.config.ts
import { defineConfig } from "file:///C:/Users/gongl/Desktop/my-app/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/gongl/Desktop/my-app/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import tailwindcss from "file:///C:/Users/gongl/Desktop/my-app/node_modules/@tailwindcss/vite/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\gongl\\Desktop\\my-app";
var vite_config_default = defineConfig({
  root: "./src",
  plugins: [vue(), tailwindcss()],
  // 配置别名
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    outDir: "../dist",
    minify: false,
    emptyOutDir: true
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
        rewrite: (path2) => path2.replace(new RegExp("^/agent"), "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnb25nbFxcXFxEZXNrdG9wXFxcXG15LWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ29uZ2xcXFxcRGVza3RvcFxcXFxteS1hcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2dvbmdsL0Rlc2t0b3AvbXktYXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByb290OiAnLi9zcmMnLFxuICBwbHVnaW5zOiBbdnVlKCksIHRhaWx3aW5kY3NzKCldLFxuICAvLyBcdTkxNERcdTdGNkVcdTUyMkJcdTU0MERcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJy4uL2Rpc3QnLFxuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gIH0sXG4gICAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgICAgcG9ydDogMzIwMDEsXG4gICAgICBvcGVuOiB0cnVlLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gXHU0RUUzXHU3NDA2IC9kZXYtYXBpIFx1NzY4NFx1OEJGN1x1NkM0MlxuICAgICAgICBcIi9hZ2VudFwiOiB7XG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIC8vIFx1NEVFM1x1NzQwNlx1NzZFRVx1NjgwN1x1NTczMFx1NTc0MFx1RkYxQWh0dHBzOi8vYXBpLnlvdWxhaS50ZWNoXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vY3JtLmJlYXV0eWVkdXRlY2guY29tXCIsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKFwiXlwiICsgXCIvYWdlbnRcIiksIFwiXCIpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1SLFNBQVMsb0JBQW9CO0FBQ2hULE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7QUFBQTtBQUFBLEVBRTlCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDSSxRQUFRO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxNQUVMLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBRWQsUUFBUTtBQUFBLFFBQ1IsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsSUFBSSxPQUFPLFNBQWMsR0FBRyxFQUFFO0FBQUEsTUFDaEU7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
