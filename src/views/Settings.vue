<template>
  <div class="h-full flex flex-col">
    <!-- 添加XFMAPPHeader组件 -->
    <XFMAPPHeader class="flex-shrink-0 z-[1000]" title-position="center"> </XFMAPPHeader>

    <div class="flex-1 p-2 max-w-lg mx-auto overflow-y-auto w-full box-border sm:p-4">
      <!-- 设置选项 -->
      <var-card class="mb-4" elevation="2">
        <div class="p-6">
          <h4 class="text-base font-semibold mb-4">应用设置</h4>

          <!-- 主题设置 -->
          <div class="flex items-center justify-between py-3 cursor-pointer">
            <div class="flex items-center flex-1">
              <var-icon name="palette" class="mr-3 text-gray-500" />
              <div>
                <div class="font-medium mb-0.5">主题模式</div>
                <div class="text-sm text-gray-500">选择应用主题</div>
              </div>
            </div>
            <var-select v-model="themeMode" @change="handleThemeChange" class="min-w-[120px]">
              <var-option label="浅色" value="md3Light" />
              <var-option label="深色" value="md3Dark" />
              <!-- <var-option label="跟随系统" value="auto" /> -->
            </var-select>
          </div>

          <!-- 语言设置 -->
          <div class="flex items-center justify-between py-3 cursor-pointer">
            <div class="flex items-center flex-1">
              <var-icon name="translate" class="mr-3 text-gray-500" />
              <div>
                <div class="font-medium mb-0.5">语言</div>
                <div class="text-sm text-gray-500">选择应用语言</div>
              </div>
            </div>
            <var-select v-model="language" @change="handleLanguageChange" class="min-w-[120px]">
              <var-option label="简体中文" value="zh-CN" />
              <var-option label="English" value="en-US" />
            </var-select>
          </div>

          <!-- 通知设置 -->
          <div class="flex items-center justify-between py-3 cursor-pointer">
            <div class="flex items-center flex-1">
              <var-icon name="bell" class="mr-3 text-gray-500" />
              <div>
                <div class="font-medium mb-0.5">推送通知</div>
                <div class="text-sm text-gray-500">接收应用通知</div>
              </div>
            </div>
            <var-switch v-model="notifications" @change="handleNotificationChange" />
          </div>

          <!-- 自动登录 -->
          <div class="flex items-center justify-between py-3 cursor-pointer">
            <div class="flex items-center flex-1">
              <var-icon name="login" class="mr-3 text-gray-500" />
              <div>
                <div class="font-medium mb-0.5">自动登录</div>
                <div class="text-sm text-gray-500">启动时自动登录</div>
              </div>
            </div>
            <var-switch v-model="autoLogin" @change="handleAutoLoginChange" />
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="p-6 border-t border-gray-100">
          <h4 class="text-base font-semibold mb-4">数据管理</h4>

          <div class="flex items-center justify-between py-3 cursor-pointer" @click="clearCache">
            <div class="flex items-center flex-1">
              <var-icon name="delete-sweep" class="mr-3 text-gray-500" />
              <div>
                <div class="font-medium mb-0.5">清除缓存</div>
                <div class="text-sm text-gray-500">清除应用缓存数据</div>
              </div>
            </div>
            <var-icon name="chevron-right" class="text-gray-400" />
          </div>

          <div class="flex items-center justify-between py-3 cursor-pointer" @click="exportData">
            <div class="flex items-center flex-1">
              <var-icon name="download" class="mr-3 text-gray-500" />
              <div>
                <div class="font-medium mb-0.5">导出数据</div>
                <div class="text-sm text-gray-500">导出用户数据</div>
              </div>
            </div>
            <var-icon name="chevron-right" class="text-gray-400" />
          </div>
        </div>

        <!-- 关于 -->
        <div class="p-6 border-t border-gray-100">
          <h4 class="text-base font-semibold mb-4">关于</h4>

          <div class="flex items-center justify-between py-3 cursor-pointer" @click="showAbout">
            <div class="flex items-center flex-1">
              <var-icon name="information" class="mr-3 text-gray-500" />
              <div>
                <div class="font-medium mb-0.5">关于应用</div>
                <div class="text-sm text-gray-500">版本 {{ appStore.config.version }}</div>
              </div>
            </div>
            <var-icon name="chevron-right" class="text-gray-400" />
          </div>

          <div class="flex items-center justify-between py-3 cursor-pointer" @click="checkUpdate">
            <div class="flex items-center flex-1">
              <var-icon name="update" class="mr-3 text-gray-500" />
              <div>
                <div class="font-medium mb-0.5">检查更新</div>
                <div class="text-sm text-gray-500">检查应用更新</div>
              </div>
            </div>
            <var-icon name="chevron-right" class="text-gray-400" />
          </div>
        </div>
      </var-card>

      <!-- 退出登录按钮 -->
      <div class="mt-6">
        <var-button type="danger" block size="large" @click="handleLogout" :loading="isLoggingOut">
          <var-icon name="logout" class="mr-2" />
          退出登录
        </var-button>
      </div>
    </div>

    <!-- 确认退出对话框 -->
    <var-dialog v-model:show="showLogoutDialog" title="确认退出" message="确定要退出登录吗？" confirm-button-text="确定" cancel-button-text="取消" @confirm="confirmLogout" />

    <!-- 关于应用对话框 -->
    <var-dialog v-model:show="showAboutDialog" title="关于应用" confirm-button-text="确定">
      <div class="text-center p-4">
        <div class="app-info">
          <var-icon name="application" size="48" color="#3a7afe" class="mb-4" />
          <h3 class="my-2">{{ appStore.config.appName }}</h3>
          <p class="my-1 text-gray-500 text-sm">版本：{{ appStore.config.version }}</p>
          <p class="my-1 text-gray-500 text-sm">构建时间：{{ buildTime }}</p>
        </div>
      </div>
    </var-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore, useAppStore, useCacheStore } from "@/stores";
import { Snackbar, Dialog, StyleProvider, Themes } from "@varlet/ui";
import API from "@/API";

// 导入XFMAPPHeader组件
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";

const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const cacheStore = useCacheStore();

// 响应式数据
const isLoggingOut = ref(false);
const showLogoutDialog = ref(false);
const showAboutDialog = ref(false);

// 设置选项
console.log("设置筛选项", userStore.preferences);
const themeMode = ref(userStore.preferences.theme || "light");
const language = ref(userStore.preferences.language || "zh-CN");
const notifications = ref(userStore.preferences.notifications ?? true);
const autoLogin = ref(userStore.preferences.autoLogin ?? false);

// 构建时间
const buildTime = computed(() => {
  return new Date().toLocaleDateString();
});

// 主题变更
const handleThemeChange = (value) => {
  userStore.updatePreferences({ theme: value });
  // 这里可以添加实际的主题切换逻辑
  StyleProvider(Themes[value]);
  Snackbar.success(`主题已切换为${value === "light" ? "浅色" : value === "dark" ? "深色" : "跟随系统"}模式`);
};

// 语言变更
const handleLanguageChange = (value) => {
  userStore.updatePreferences({ language: value });
  Snackbar.success(`语言已切换为${value === "zh-CN" ? "简体中文" : "English"}`);
};

// 通知设置变更
const handleNotificationChange = (value) => {
  userStore.updatePreferences({ notifications: value });
  Snackbar.success(`推送通知已${value ? "开启" : "关闭"}`);
};

// 自动登录设置变更
const handleAutoLoginChange = (value) => {
  userStore.updatePreferences({ autoLogin: value });
  Snackbar.success(`自动登录已${value ? "开启" : "关闭"}`);
};

// 清除缓存
const clearCache = async () => {
  try {
    await Dialog.confirm({
      title: "确认清除",
      message: "确定要清除所有缓存数据吗？此操作不可恢复。",
    });

    cacheStore.clearAllCache();
    Snackbar.success("缓存已清除");
  } catch {
    // 用户取消
  }
};

// 导出数据
const exportData = () => {
  try {
    const userData = {
      userInfo: userStore.userInfo,
      preferences: userStore.preferences,
      searchHistory: cacheStore.searchHistory,
      recentItems: cacheStore.recentItems,
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `user_data_${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    Snackbar.success("数据导出成功");
  } catch (error) {
    Snackbar.error("数据导出失败");
  }
};

// 显示关于对话框
const showAbout = () => {
  showAboutDialog.value = true;
};

// 检查更新
const checkUpdate = () => {
  // 模拟检查更新
  Snackbar.loading("检查更新中...");

  setTimeout(() => {
    Snackbar.success("当前已是最新版本");
  }, 2000);
};

// 退出登录
const handleLogout = () => {
  showLogoutDialog.value = true;
};

// 确认退出登录
const confirmLogout = async () => {
  try {
    isLoggingOut.value = true;

    // 模拟退出登录 API 调用
    await API?.APILogin.APIAuthAuthLogout({
      loginType: "APP",
    });

    // 清除用户数据
    userStore.logout();

    // 清除临时缓存
    cacheStore.clearAllCache();

    Snackbar.success("已退出登录");

    // 跳转到登录页
    router.replace("/login");
  } catch (error) {
    Snackbar.error("退出登录失败");
  } finally {
    isLoggingOut.value = false;
    showLogoutDialog.value = false;
  }
};

// 组件挂载时初始化
onMounted(() => {
  // 可以在这里加载一些设置相关的数据
});
</script>
