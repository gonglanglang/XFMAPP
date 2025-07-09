<template>
  <div class="safe-area-header">
    <!-- 安全区占位 -->
    <div class="safe-area-top"></div>

    <!-- 头部内容区域 -->
    <div class="header-content" :class="contentClass">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// 定义props
const props = defineProps({
  // 背景颜色
  backgroundColor: {
    type: String,
    default: "#ffffff",
  },
  // 是否固定定位
  fixed: {
    type: Boolean,
    default: true,
  },
  // z-index层级
  zIndex: {
    type: [Number, String],
    default: 1000,
  },
  // 内容区域的额外样式类
  contentClass: {
    type: String,
    default: "",
  },
  // 是否显示阴影
  shadow: {
    type: Boolean,
    default: false,
  },
});

// 计算样式
const headerStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  position: props.fixed ? "fixed" : "relative",
  zIndex: props.zIndex,
  boxShadow: props.shadow ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
}));
</script>

<style scoped>
.safe-area-header {
  width: 100%;
  background-color: v-bind("props.backgroundColor");
  z-index: v-bind("props.zIndex");
  box-shadow: v-bind('props.shadow ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none"');
}

.safe-area-top {
  height: env(safe-area-inset-top);
  background-color: inherit;
}

.header-content {
  background-color: inherit;
  width: 100%;
}

/* 为固定定位的头部添加占位空间 */
.safe-area-header.fixed + * {
  padding-top: calc(env(safe-area-inset-top) + var(--header-height, 56px));
}
</style>
