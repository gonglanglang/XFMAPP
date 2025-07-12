import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Varlet from "@varlet/ui";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { SplashScreen } from "@capacitor/splash-screen";

// 创建Vue应用
const app = createApp(App);
const pinia = createPinia();

// 图标库
import "../public/iconFont";
// 添加持久化插件
pinia.use(piniaPluginPersistedstate);
// 注册UI库
import "@varlet/ui/es/style";
app.use(Varlet);

app.use(pinia);
// 使用路由
app.use(router);

app.mount("#app");

// 延迟隐藏启动屏幕，给应用加载时间
setTimeout(() => {
  SplashScreen.hide({
    fadeOutDuration: 300,
  });
}, 2000); // 2秒后隐藏

// 开发环境下启用Eruda调试工具
if (process.env.NODE_ENV === "development") {
  import("eruda").then((eruda) => {
    eruda.default.init();
    console.log("Eruda调试工具已启动");
  });
}
