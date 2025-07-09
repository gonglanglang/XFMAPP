<template>
  <header v-if="showHeader" class="app-header">
    <var-app-bar :title="route?.meta?.title" :safe-area-top="true" v-bind="$attrs">
      <!-- 左侧内容区域 -->
      <template #left>
        <var-icon v-if="showBack" name="chevron-left" size="24" @click="goBack" />
      </template>
      <!-- 主内容 -->
      <template #content>
        <slot name="content"></slot>
      </template>
      <!-- 右侧内容区域 -->
      <template #right>
        <slot name="right"></slot>
      </template>
    </var-app-bar>
  </header>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Snackbar } from "@varlet/ui";

const router = useRouter();
const route = useRoute();

// 定义props
const props = defineProps({
  username: {
    type: String,
    default: "用户",
  },
});

// 根据路由状态判断当前是否显示返回按钮
const showBack = computed(() => {
  if (route?.meta?.showBack === undefined) {
    return true;
  } else return route.meta.showBack;
});

// 根据路由控制显示状态
const showHeader = computed(() => {
  return route.name !== "Login";
});

const showUserInfo = computed(() => {
  return route.name === "Home";
});

const currentTitle = computed(() => {
  const titles = {
    Home: "幸福美 CRM",
    Camera: "拍照",
    Profile: "个人中心",
    Settings: "设置",
  };
  return titles[route.name] || "应用";
});

onMounted(() => {
  console.log(route);
});

// 返回按钮
const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.app-header {
  flex-shrink: 0;
  z-index: 1000;
}
</style>
