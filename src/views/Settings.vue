<template>
  <div class="settings-container">
    <div class="content-area">
      <!-- 设置选项 -->
      <var-card class="settings-card" elevation="2">
        <div class="settings-section">
          <h4 class="section-title">应用设置</h4>

          <!-- 主题设置 -->
          <div class="setting-item">
            <div class="setting-info">
              <var-icon name="palette" class="setting-icon" />
              <div>
                <div class="setting-label">主题模式</div>
                <div class="setting-desc">选择应用主题</div>
              </div>
            </div>
            <var-select v-model="themeMode" @change="handleThemeChange" class="theme-select">
              <var-option label="浅色" value="light" />
              <var-option label="深色" value="dark" />
              <var-option label="跟随系统" value="auto" />
            </var-select>
          </div>

          <!-- 语言设置 -->
          <div class="setting-item">
            <div class="setting-info">
              <var-icon name="translate" class="setting-icon" />
              <div>
                <div class="setting-label">语言</div>
                <div class="setting-desc">选择应用语言</div>
              </div>
            </div>
            <var-select v-model="language" @change="handleLanguageChange" class="language-select">
              <var-option label="简体中文" value="zh-CN" />
              <var-option label="English" value="en-US" />
            </var-select>
          </div>

          <!-- 通知设置 -->
          <div class="setting-item">
            <div class="setting-info">
              <var-icon name="bell" class="setting-icon" />
              <div>
                <div class="setting-label">推送通知</div>
                <div class="setting-desc">接收应用通知</div>
              </div>
            </div>
            <var-switch v-model="notifications" @change="handleNotificationChange" />
          </div>

          <!-- 自动登录 -->
          <div class="setting-item">
            <div class="setting-info">
              <var-icon name="login" class="setting-icon" />
              <div>
                <div class="setting-label">自动登录</div>
                <div class="setting-desc">启动时自动登录</div>
              </div>
            </div>
            <var-switch v-model="autoLogin" @change="handleAutoLoginChange" />
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="settings-section">
          <h4 class="section-title">数据管理</h4>

          <div class="setting-item" @click="clearCache">
            <div class="setting-info">
              <var-icon name="delete-sweep" class="setting-icon" />
              <div>
                <div class="setting-label">清除缓存</div>
                <div class="setting-desc">清除应用缓存数据</div>
              </div>
            </div>
            <var-icon name="chevron-right" class="arrow-icon" />
          </div>

          <div class="setting-item" @click="exportData">
            <div class="setting-info">
              <var-icon name="download" class="setting-icon" />
              <div>
                <div class="setting-label">导出数据</div>
                <div class="setting-desc">导出用户数据</div>
              </div>
            </div>
            <var-icon name="chevron-right" class="arrow-icon" />
          </div>
        </div>

        <!-- 关于 -->
        <div class="settings-section">
          <h4 class="section-title">关于</h4>

          <div class="setting-item" @click="showAbout">
            <div class="setting-info">
              <var-icon name="information" class="setting-icon" />
              <div>
                <div class="setting-label">关于应用</div>
                <div class="setting-desc">版本 {{ appStore.config.version }}</div>
              </div>
            </div>
            <var-icon name="chevron-right" class="arrow-icon" />
          </div>

          <div class="setting-item" @click="checkUpdate">
            <div class="setting-info">
              <var-icon name="update" class="setting-icon" />
              <div>
                <div class="setting-label">检查更新</div>
                <div class="setting-desc">检查应用更新</div>
              </div>
            </div>
            <var-icon name="chevron-right" class="arrow-icon" />
          </div>
        </div>
      </var-card>

      <!-- 退出登录按钮 -->
      <div class="logout-section">
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
      <div class="about-content">
        <div class="app-info">
          <var-icon name="application" size="48" color="#3a7afe" class="mb-4" />
          <h3>{{ appStore.config.appName }}</h3>
          <p>版本：{{ appStore.config.version }}</p>
          <p>构建时间：{{ buildTime }}</p>
        </div>
      </div>
    </var-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore, useAppStore, useCacheStore } from "@/stores";
import { Snackbar, Dialog } from "@varlet/ui";

const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const cacheStore = useCacheStore();

// 响应式数据
const isLoggingOut = ref(false);
const showLogoutDialog = ref(false);
const showAboutDialog = ref(false);

// 设置选项
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

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

<style scoped>
.settings-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
  padding-bottom: 2rem;
}

.content-area {
  padding: 1.25rem;
  max-width: 32rem;
  margin: 0 auto;
}

.user-info-card {
  background: white;
  margin-bottom: 1rem;
  border-radius: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 1.5rem;
}

.user-avatar {
  margin-right: 1rem;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.user-role {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.settings-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.settings-section {
  padding: 1.5rem;
}

.settings-section:not(:last-child) {
  border-bottom: 1px solid #f3f4f6;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.setting-item:hover {
  background-color: #f9fafb;
  border-radius: 8px;
  margin: 0 -0.5rem;
  padding: 0.75rem 0.5rem;
}

.setting-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.setting-icon {
  margin-right: 0.75rem;
  color: #6b7280;
}

.setting-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.125rem;
}

.setting-desc {
  font-size: 0.875rem;
  color: #6b7280;
}

.arrow-icon {
  color: #9ca3af;
}

.theme-select,
.language-select {
  min-width: 120px;
}

.logout-section {
  margin-top: 1.5rem;
}

.about-content {
  text-align: center;
  padding: 1rem;
}

.app-info h3 {
  margin: 0.5rem 0;
  color: #374151;
}

.app-info p {
  margin: 0.25rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .content-area {
    padding: 1rem;
  }

  .user-info {
    padding: 1rem;
  }

  .settings-section {
    padding: 1rem;
  }
}
</style>
