<template>
  <div id="app" class="app-container">
    <!-- 主内容区域 -->
    <main class="app-main" :class="{ 'with-header': showHeader, 'with-tabbar': showTabBar }">
      <router-view />
    </main>

    <!-- 底部TabBar -->
    <footer v-if="showTabBar" class="app-footer">
      <var-bottom-navigation v-model:active="activeTab" :safe-area="true" @change="handleTabChange" color="#3a7afe">
        <var-bottom-navigation-item name="home" icon="home" label="首页" />
        <var-bottom-navigation-item name="crm" icon="cog" label="CRM" />
        <var-bottom-navigation-item name="settings" icon="cog" label="设置" />
      </var-bottom-navigation>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Snackbar, StyleProvider, Themes } from "@varlet/ui";
import { useUserStore } from "@/stores";
// import Themes from "@/assets/JavaScript/theme.js"; // 自定义主题
// 自定义组件
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const username = ref("");
const activeTab = ref("home");

// 应用启动时恢复主题设置
onMounted(() => {
  const theme = userStore.preferences.theme;
  if (theme) {
    if (theme === "md3Light") {
      StyleProvider(Themes.md3Light);
    } else if (theme === "md3Dark") {
      StyleProvider(Themes.md3Dark);
    } else if (theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: md3Dark)").matches;
      StyleProvider(prefersDark ? Themes.md3Dark : Themes.md3Light);
    }
  }
});

const showTabBar = computed(() => {
  return !!route?.meta.showTabBar;
});

// 根据路由控制显示状态
const showHeader = computed(() => {
  return route.name !== "Login";
});

const showBackButton = computed(() => {
  return route.name !== "Home";
});

const showUserInfo = computed(() => {
  return route.name === "Home";
});

// 监听路由变化，更新activeTab
watch(
  () => route.name,
  (newName) => {
    if (newName === "Home") activeTab.value = "home";
    else if (newName === "crm") activeTab.value = "crm";
    else if (newName === "Settings") activeTab.value = "settings";
  }
);

// TabBar切换处理
const handleTabChange = (name) => {
  const routes = {
    home: "/",
    crm: "/crm",
    profile: "/profile",
    settings: "/settings",
  };
  if (routes[name]) {
    router.replace(routes[name]);
  }
};

// 返回按钮
const goBack = () => {
  router.go(-1);
};

// 退出登录
const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  Snackbar.success("已退出登录");
  setTimeout(() => {
    router.push("/login");
  }, 1000);
};

// 获取用户名
username.value = localStorage.getItem("username") || "用户";
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.app-header {
  flex-shrink: 0;
  z-index: 1000;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  /* 默认内边距 */
  padding: 0;
}

.app-main.with-header {
  /* 如果有头部，预留头部高度 */
  padding-top: 0;
}

.app-main.with-tabbar {
  /* 如果有底部TabBar，预留底部高度 */
  padding-bottom: 0;
}

.app-footer {
  flex-shrink: 0;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* 或者为安卓提供固定值 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .app-footer {
    padding-bottom: 10px; /* 安卓备用值 */
  }
}

/* 安全区适配 */
@supports (padding: max(0px)) {
  .app-container {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}
</style>
