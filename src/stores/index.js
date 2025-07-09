// 导出所有 store
export { useUserStore } from "./user";
export { useAppStore } from "./app";
export { useCacheStore } from "./cache";

// 导出 store 重置函数
export const resetAllStores = () => {
  const userStore = useUserStore();
  const appStore = useAppStore();
  const cacheStore = useCacheStore();

  userStore.$reset();
  appStore.$reset();
  cacheStore.$reset();
};
