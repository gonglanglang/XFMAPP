<template>
  <div class="h-full flex flex-col">
    <!-- 添加XFMAPPHeader组件 -->
    <XFMAPPHeader class="flex-shrink-0 z-[1000]" title-position="center"> </XFMAPPHeader>

    <!-- 主要内容区域 -->
    <div class="flex-1 p-2 max-w-lg mx-auto overflow-y-auto w-full box-border sm:p-4">
      <var-collapse v-model="collapseValue" @change="handleChange">
        <!-- 优化后的折叠面板项 -->
        <var-collapse-item name="1" v-for="(model, index) in managementModule" :key="`module-${index}`" class="mb-4 last:mb-0">
          <template #title>
            <div class="flex items-center justify-between w-full py-2">
              <div class="flex items-center">
                <div class="w-1 h-6 bg-gradient-to-b from-blue-500 rounded-full mr-3"></div>
                <span class="text-lg font-semibold tracking-wide">{{ model.label || "线下模块" }}</span>
                <var-icon name="fire" class="ml-2 text-orange-500 animate-pulse" :size="18" />
              </div>
              <div class="text-xs px-2 py-1 rounded-full">{{ model.values?.length || 0 }} 个应用</div>
            </div>
          </template>

          <template #default>
            <div class="pt-2 pb-4">
              <var-row :gutter="[12, 12]">
                <var-col :span="6" v-for="(app, appIndex) in model.values" :key="`app-${appIndex}-${app.label}`">
                  <div class="flex flex-col group">
                    <var-paper :elevation="2" :width="75" :height="75" ripple class="flex flex-col px-3 py-2 box-border justify-center items-center cursor-pointer transition-all duration-300 ease-in-out rounded-xl" @click="navigateToApp(app)" @mouseenter="handleAppHover(app, true)" @mouseleave="handleAppHover(app, false)">
                      <!-- 图标容器 -->
                      <div class="relative mb-2">
                        <svg class="w-8 h-8 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600" aria-hidden="true">
                          <use :xlink:href="getAppIcon(app)"></use>
                        </svg>
                        <!-- 状态指示器 -->
                        <div v-if="app.isNew" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                      </div>

                      <!-- 应用名称 -->
                      <!-- <var-ellipsis :tooltip="true" class="text-xs text-center font-medium transition-colors duration-200" :style="{ maxWidth: '60px' }">
                        {{ app.label || "未命名应用" }}
                      </var-ellipsis> -->
                      <span class="text-xs text-center font-medium transition-colors duration-200" :style="{ maxWidth: '60px' }">
                        {{ app.label || "未命名应用" }}
                      </span>

                      <!-- 加载状态 -->
                      <div v-if="loadingApps.has(app.path)" class="absolute inset-0 flex items-center justify-center rounded-xl">
                        <var-loading type="circle" size="small" />
                      </div>
                    </var-paper>
                  </div>
                </var-col>
              </var-row>

              <!-- 空状态提示 -->
              <div v-if="!model.values || model.values.length === 0" class="text-center py-8 text-gray-400">
                <var-icon name="inbox" :size="32" class="mb-2 opacity-50" />
                <p class="text-sm">暂无可用应用</p>
              </div>
            </div>
          </template>
        </var-collapse-item>
      </var-collapse>
    </div>

    <!-- 消息提示 -->
    <var-snackbar v-model:show="showMessage" :type="messageType" :duration="3000">
      {{ message }}
    </var-snackbar>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Camera } from "@capacitor/camera";
// 导入XFMAPPHeader组件
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";

const router = useRouter();
const photoUrl = ref(null);
const showMessage = ref(false);
const message = ref("");
const messageType = ref("success");
const date = new Date();
const collapseValue = ref(["1", "2"]);
const loadingApps = ref(new Set()); // 跟踪正在加载的应用

// 优化后的管理模块数据结构
const managementModule = ref({
  eventManagement: {
    label: "线下模块",
    values: [
      {
        label: "活动管理",
        path: "/XianXia_HuoDong",
        icon: "#icon-huodongguanli",
        isNew: false,
        description: "管理线下活动和事件",
      },
    ],
  },
});

// 获取应用图标
const getAppIcon = (app) => {
  return app.icon || "#icon-huodongguanli";
};

// 处理应用悬停效果
const handleAppHover = (app, isHover) => {
  // 可以在这里添加悬停时的额外逻辑
  if (isHover && app.description) {
    // 可以显示应用描述等
  }
};

// 优化后的导航函数
const navigateToApp = async (app) => {
  if (!app || !app.path) {
    showNotification("该功能暂未开放", "warning");
    return;
  }

  try {
    // 添加加载状态
    loadingApps.value.add(app.path);

    // 模拟异步操作（如果需要预加载数据）
    await new Promise((resolve) => setTimeout(resolve, 300));

    await router.push(app.path);
    showNotification(`正在跳转到${app.label}`, "info");
  } catch (error) {
    console.error("路由跳转失败:", error);
    showNotification("页面跳转失败，请重试", "error");
  } finally {
    // 移除加载状态
    loadingApps.value.delete(app.path);
  }
};

// 统一的通知函数
const showNotification = (msg, type = "info") => {
  message.value = msg;
  messageType.value = type;
  showMessage.value = true;
};

// 折叠面板变化处理
const handleChange = (value) => {
  console.log("折叠面板状态变化:", value);
};

const takePhoto = async () => {
  try {
    const photo = await Camera.getPhoto({
      resultType: "uri",
    });
    photoUrl.value = photo.webPath;
    showNotification("照片拍摄成功！", "success");
  } catch (error) {
    console.warn("用户取消拍照", error);
    showNotification("拍照已取消", "warning");
  }
};

const clearPhoto = () => {
  photoUrl.value = null;
  showNotification("照片已删除", "info");
};
</script>
