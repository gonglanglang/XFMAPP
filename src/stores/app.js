import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    // 应用配置
    config: {
      appName: "Vue Capacitor App",
      version: "1.0.0",
      apiBaseUrl: "",
      debug: false,
    },
    // 设备信息
    device: {
      platform: "",
      model: "",
      version: "",
      uuid: "",
    },
    // 网络状态
    network: {
      isOnline: true,
      connectionType: "wifi",
    },
    // 应用状态
    loading: false,
    error: null,
    // 页面历史
    pageHistory: [],
  }),

  getters: {
    // 是否为移动端
    isMobile: (state) => {
      return ["ios", "android"].includes(state.device.platform);
    },
    // 是否为开发模式
    isDevelopment: (state) => {
      return state.config.debug;
    },
  },

  actions: {
    // 设置应用配置
    setConfig(config) {
      this.config = { ...this.config, ...config };
    },

    // 设置设备信息
    setDevice(device) {
      this.device = { ...this.device, ...device };
    },

    // 设置网络状态
    setNetwork(network) {
      this.network = { ...this.network, ...network };
    },

    // 设置加载状态
    setLoading(loading) {
      this.loading = loading;
    },

    // 设置错误信息
    setError(error) {
      this.error = error;
    },

    // 清除错误
    clearError() {
      this.error = null;
    },

    // 添加页面历史
    addPageHistory(page) {
      this.pageHistory.push({
        path: page,
        timestamp: Date.now(),
      });
      // 只保留最近 10 条记录
      if (this.pageHistory.length > 10) {
        this.pageHistory.shift();
      }
    },
  },

  // 持久化配置
  persist: {
    key: "app-store",
    storage: localStorage,
    paths: ["config", "device", "pageHistory"],
  },
});
