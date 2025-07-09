import { defineStore } from "pinia";

export const useCacheStore = defineStore("cache", {
  state: () => ({
    // API 缓存
    apiCache: new Map(),
    // 临时数据缓存
    tempData: {},
    // 表单数据缓存
    formData: {},
    // 搜索历史
    searchHistory: [],
    // 最近访问
    recentItems: [],
  }),

  getters: {
    // 获取缓存的 API 数据
    getCachedApi: (state) => (key) => {
      const cached = state.apiCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return cached.data;
      }
      return null;
    },

    // 获取搜索历史（去重）
    uniqueSearchHistory: (state) => {
      return [...new Set(state.searchHistory)];
    },
  },

  actions: {
    // 缓存 API 数据
    setCacheApi(key, data, ttl = 5 * 60 * 1000) {
      // 默认 5 分钟
      this.apiCache.set(key, {
        data,
        expiry: Date.now() + ttl,
      });
    },

    // 删除 API 缓存
    deleteCacheApi(key) {
      this.apiCache.delete(key);
    },

    // 清除过期的 API 缓存
    clearExpiredCache() {
      const now = Date.now();
      for (const [key, value] of this.apiCache.entries()) {
        if (value.expiry <= now) {
          this.apiCache.delete(key);
        }
      }
    },

    // 设置临时数据
    setTempData(key, data) {
      this.tempData[key] = data;
    },

    // 获取临时数据
    getTempData(key) {
      return this.tempData[key];
    },

    // 删除临时数据
    deleteTempData(key) {
      delete this.tempData[key];
    },

    // 保存表单数据
    saveFormData(formName, data) {
      this.formData[formName] = {
        data,
        timestamp: Date.now(),
      };
    },

    // 获取表单数据
    getFormData(formName) {
      return this.formData[formName]?.data;
    },

    // 添加搜索历史
    addSearchHistory(keyword) {
      if (keyword && keyword.trim()) {
        // 移除重复项
        this.searchHistory = this.searchHistory.filter((item) => item !== keyword);
        // 添加到开头
        this.searchHistory.unshift(keyword);
        // 只保留最近 20 条
        if (this.searchHistory.length > 20) {
          this.searchHistory = this.searchHistory.slice(0, 20);
        }
      }
    },

    // 清除搜索历史
    clearSearchHistory() {
      this.searchHistory = [];
    },

    // 添加最近访问项
    addRecentItem(item) {
      // 移除重复项
      this.recentItems = this.recentItems.filter((recent) => recent.id !== item.id);
      // 添加到开头
      this.recentItems.unshift({
        ...item,
        timestamp: Date.now(),
      });
      // 只保留最近 50 条
      if (this.recentItems.length > 50) {
        this.recentItems = this.recentItems.slice(0, 50);
      }
    },

    // 清除所有缓存
    clearAllCache() {
      this.apiCache.clear();
      this.tempData = {};
      this.formData = {};
    },
  },

  // 持久化配置
  persist: {
    key: "cache-store",
    storage: localStorage,
    paths: ["searchHistory", "recentItems", "formData"],
    // 自定义序列化（因为 Map 不能直接序列化）
    serializer: {
      serialize: (state) => {
        const serialized = { ...state };
        // 将 Map 转换为对象
        serialized.apiCache = Object.fromEntries(state.apiCache);
        return JSON.stringify(serialized);
      },
      deserialize: (value) => {
        const parsed = JSON.parse(value);
        // 将对象转换回 Map
        parsed.apiCache = new Map(Object.entries(parsed.apiCache || {}));
        return parsed;
      },
    },
  },
});
