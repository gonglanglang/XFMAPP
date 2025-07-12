import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Crm from "../views/Crm.vue";
import Profile from "../views/Profile.vue";
import Settings from "../views/Settings.vue";

/* 通用模块 */
import Edit from "@/views/Edit/index.vue";

/* 线下模块 */
import XianXia_HuoDong from "../views/CRM/XianXiaMgt/HuoDong.vue";
import XianXia_HuoDong_Info from "../views/CRM/XianXiaMgt/HuoDong/info.vue";
import XianXia_HuoDong_dynamics from "@/views/CRM/XianXiaMgt/HuoDong/dynamics.vue";
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
    meta: { requiresAuth: true, title: "CRM", showBack: false, showTabBar: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true, title: "Profile", showBack: false, showTabBar: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: { requiresAuth: true, showTabBar: true, showBack: false, title: "设置" },
  },

  /* 通用模块 */
  {
    path: "/Edit",
    name: "Edit",
    component: Edit,
    meta: { requiresAuth: true, showTabBar: false, showBack: true },
  },

  /* 线下模块 */
  {
    path: "/XianXia_HuoDong",
    name: "XianXia_HuoDong",
    component: XianXia_HuoDong,
    meta: { requiresAuth: true, title: "活动管理" },
  },
  {
    path: "/XianXia_HuoDong_Info",
    name: "XianXia_HuoDong_Info",
    component: XianXia_HuoDong_Info,
    meta: { requiresAuth: true, title: "活动详情" },
  },
  {
    path: "/XianXia_HuoDong_dynamics",
    name: "XianXia_HuoDong_dynamics",
    component: XianXia_HuoDong_dynamics,
    meta: { requiresAuth: true, title: "学员动态" },
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
