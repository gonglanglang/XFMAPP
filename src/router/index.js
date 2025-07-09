import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Crm from "../views/Crm.vue";
import Profile from "../views/Profile.vue";
import Settings from "../views/Settings.vue";

/* 线下模块 */
import XianXia_HuoDong from "../views/CRM/XianXiaMgt/HuoDong.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
      title: "首页",
      showBack: false,
      showTabBar: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/crm",
    name: "Crm",
    component: Crm,
    meta: { requiresAuth: true, title: "CRM", showTabBar: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true, title: "Profile", showTabBar: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: { requiresAuth: true, showTabBar: true },
  },

  /* 线下模块 */
  {
    path: "/XianXia_HuoDong",
    name: "XianXia_HuoDong",
    component: XianXia_HuoDong,
    meta: { requiresAuth: true, title: "活动管理" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫 - 检查登录状态
router.beforeEach((to, from, next) => {
  const useUser = useUserStore();

  if (to.meta.requiresAuth) {
    if (useUser?.isLoggedIn) {
      next();
    } else {
      next("/login");
    }
  } else {
    if (to.path === "/login" && useUser?.isLoggedIn) {
      next("/");
    } else {
      next();
    }
  }
});

export default router;
