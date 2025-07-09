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
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Snackbar } from "@varlet/ui";
// 自定义组件
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";

const router = useRouter();
const route = useRoute();

const username = ref("");
const activeTab = ref("home");

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
    router.push(routes[name]);
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
