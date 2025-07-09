<template>
  <div class="bg-gradient-to-br from-slate-50 to-slate-300 h-full flex flex-col">
    <!-- 用于解决安全区问题的头部组件 -->
    <XFMSafeAreaHeader>
      <var-tabs class="flex-shrink-0 z-[1000]" v-model:active="active">
        <var-tab>今天</var-tab>
        <var-tab>工作圈</var-tab>
      </var-tabs>
    </XFMSafeAreaHeader>

    <!-- 主要内容区域 -->
    <div class="flex-1 p-5 max-w-lg mx-auto overflow-y-auto w-full box-border sm:p-4">
      <!-- <var-card class="bg-white mb-5" elevation="2">
        <div class="text-center py-8 px-5 sm:py-5 sm:px-4">
          <var-icon name="camera" size="48" color="#667eea" class="mb-4" />
          <h2 class="text-2xl font-semibold text-gray-800 mb-2 sm:text-xl">欢迎使用幸福美 CRM！</h2>
          <p class="text-gray-600 text-base m-0">点击下方按钮开始拍照体验</p>
        </div>
      </var-card> -->

      <!-- 拍照按钮 -->
      <!-- <var-button type="primary" size="large" block @click="takePhoto" class="bg-gradient-to-r from-indigo-500 to-purple-500 h-14 text-base font-semibold mb-5">
        <var-icon name="camera" />
        拍照
      </var-button> -->

      <!-- 照片显示区域 -->
      <!-- <var-card v-if="photoUrl" class="bg-white" elevation="2">
        <div class="p-5">
          <img :src="photoUrl" alt="拍摄的照片" class="w-full rounded-lg shadow-xl mb-4" />
          <div class="text-center">
            <var-button type="text" text-color="#f44336" @click="clearPhoto" class="text-sm">
              <var-icon name="delete" />
              删除照片
            </var-button>
          </div>
        </div>
      </var-card> -->
      <var-date-picker v-model="date" />
    </div>

    <!-- 消息提示 -->
    <var-snackbar v-model:show="showMessage" :type="messageType" :duration="3000">
      {{ message }}
    </var-snackbar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Camera } from "@capacitor/camera";
// 导入XFMAPPHeader组件
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";
import XFMSafeAreaHeader from "@/components/XFMSafeAreaHeader/index.vue";

const photoUrl = ref(null);
const showMessage = ref(false);
const message = ref("");
const messageType = ref("success");

const takePhoto = async () => {
  try {
    const photo = await Camera.getPhoto({
      resultType: "uri",
    });
    photoUrl.value = photo.webPath;
    message.value = "照片拍摄成功！";
    messageType.value = "success";
    showMessage.value = true;
  } catch (error) {
    console.warn("用户取消拍照", error);
    message.value = "拍照已取消";
    messageType.value = "warning";
    showMessage.value = true;
  }
};

const clearPhoto = () => {
  photoUrl.value = null;
  message.value = "照片已删除";
  messageType.value = "info";
  showMessage.value = true;
};
</script>
