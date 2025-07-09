import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    // 用户基本信息
    userInfo: null,
    token: "",
    refreshToken: "",
    // 用户权限
    permissions: [],
    roles: [],
    // 登录状态
    isLoggedIn: false,
    // 用户偏好设置
    preferences: {
      theme: "light",
      language: "zh-CN",
      notifications: true,
    },
  }),

  getters: {
    // 获取用户名
    username: (state) => state.userInfo?.username || "",
    // 获取用户头像
    avatar: (state) => state.userInfo?.avatar || "",
    // 检查是否有特定权限
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission);
    },
    // 检查是否有特定角色
    hasRole: (state) => (role) => {
      return state.roles.includes(role);
    },
  },

  actions: {
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      this.isLoggedIn = true;
    },

    // 设置 token
    setToken(token, refreshToken = "") {
      this.token = token;
      if (refreshToken) {
        this.refreshToken = refreshToken;
      }
    },

    // 设置权限
    setPermissions(permissions) {
      this.permissions = permissions;
    },

    // 设置角色
    setRoles(roles) {
      this.roles = roles;
    },

    // 更新用户偏好
    updatePreferences(preferences) {
      this.preferences = { ...this.preferences, ...preferences };
    },

    // 登出
    logout() {
      this.userInfo = null;
      this.token = "";
      this.refreshToken = "";
      this.permissions = [];
      this.roles = [];
      this.isLoggedIn = false;
    },

    // 清除所有数据
    clearAll() {
      this.$reset();
    },
  },

  // 持久化配置
  persist: {
    key: "user-store",
    storage: localStorage,
    // 只持久化部分数据
    paths: ["userInfo", "token", "refreshToken", "permissions", "roles", "isLoggedIn", "preferences"],
  },
});
