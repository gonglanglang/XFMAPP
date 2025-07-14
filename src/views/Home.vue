<template>
  <div class="h-full flex flex-col">
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

    <!-- 更新弹框 -->
    <var-dialog v-model:show="showUpdateDialog" title="发现新版本" :close-on-click-overlay="false" :close-on-key-escape="false">
      <div class="p-4">
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2">{{ updateInfo.title }}</h3>
          <p class="text-gray-600 text-sm whitespace-pre-line">{{ updateInfo.description }}</p>
          <p class="text-sm text-gray-500 mt-2">版本: {{ updateInfo.version }}</p>
          <p class="text-sm text-gray-500">大小: {{ formatFileSize(updateInfo.fileSize) }}</p>
        </div>

        <!-- 下载进度 -->
        <div v-if="isDownloading" class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">下载进度</span>
            <span class="text-sm text-gray-600">{{ downloadProgress.toFixed(2) }}%</span>
          </div>
          <var-progress :value="downloadProgress" class="mb-2" />
          <p class="text-xs text-gray-500 text-center">{{ downloadStatus }}</p>
        </div>

        <!-- 安装进度 -->
        <div v-if="isInstalling" class="mb-4">
          <div class="flex justify-center items-center">
            <var-loading type="circle" size="small" class="mr-2" />
            <span class="text-sm text-gray-600">正在安装...</span>
          </div>
        </div>
      </div>

      <template #actions>
        <div class="flex pb-4 justify-around">
          <var-button v-if="!isDownloading && !isInstalling" text @click="cancelUpdate" :disabled="updateInfo.forceUpdate">
            {{ updateInfo.forceUpdate ? "强制更新" : "稍后更新" }}
          </var-button>
          <var-button v-if="!isDownloading && !isInstalling" type="primary" @click="startUpdate"> 立即更新 </var-button>
        </div>
      </template>
    </var-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Camera } from "@capacitor/camera";
import { Device } from "@capacitor/device";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener";
import { CapacitorHttp } from "@capacitor/core";
// 导入XFMAPPHeader组件
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";
import XFMSafeAreaHeader from "@/components/XFMSafeAreaHeader/index.vue";

// 导入更新系统方法
import { checkForUpdate } from "@/tools/updateChecker";

const photoUrl = ref(null);
const showMessage = ref(false);
const message = ref("");
const messageType = ref("success");
const active = ref(0);
const date = ref(new Date());

// 更新相关状态
const showUpdateDialog = ref(false);
const updateInfo = ref({});
const isDownloading = ref(false);
const isInstalling = ref(false);
const downloadProgress = ref(0);
const downloadStatus = ref("");

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

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 取消更新
const cancelUpdate = () => {
  if (!updateInfo.value.forceUpdate) {
    showUpdateDialog.value = false;
  }
};

// 开始更新
const startUpdate = async () => {
  try {
    const deviceInfo = await Device.getInfo();

    if (deviceInfo.platform === "android") {
      await downloadAndInstallAndroid();
    } else if (deviceInfo.platform === "ios") {
      await redirectToAppStore();
    } else {
      // Web平台刷新页面
      window.location.reload();
    }
  } catch (error) {
    console.error("更新失败:", error);
    message.value = "更新失败，请稍后重试";
    messageType.value = "error";
    showMessage.value = true;
  }
};

// 辅助函数：将blob转换为base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // 移除data:xxx;base64,前缀
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Android下载并安装
const downloadAndInstallAndroid = async () => {
  isDownloading.value = true;
  downloadProgress.value = 0;
  downloadStatus.value = "准备下载...";

  try {
    const apkUrl = "https://gitee.com/sh-lyj/xfm-crm-pro-vue3/releases/download/1.0.1/app-release1.0.1.apk";
    const fileName = "app-release1.0.1.apk";
    
    downloadStatus.value = "正在连接服务器...";
    downloadProgress.value = 10;
    
    // 使用CapacitorHttp下载文件
    downloadStatus.value = "正在下载更新包...";
    downloadProgress.value = 30;
    
    const response = await CapacitorHttp.request({
      method: 'GET',
      url: apkUrl,
      responseType: 'blob'
    });

    downloadProgress.value = 80;
    downloadStatus.value = "下载完成，准备安装...";

    // 将下载的文件保存到设备
    const base64Data = await blobToBase64(response.data);
    
    downloadProgress.value = 90;
    
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Cache,
    });

    downloadProgress.value = 100;
    downloadStatus.value = "下载完成";

    isDownloading.value = false;
    isInstalling.value = true;

    // 打开APK文件进行安装
    downloadStatus.value = "安装完成";
    await FileOpener.open({
      filePath: savedFile.uri,
      contentType: 'application/vnd.android.package-archive',
    });

    // 安装完成后的处理
    setTimeout(() => {
      isInstalling.value = false;
      showUpdateDialog.value = false;
      message.value = "APK已打开，请按照提示完成安装";
      messageType.value = "success";
      showMessage.value = true;
    }, 2000);

  } catch (error) {
    console.error("下载或安装失败:", error);
    isDownloading.value = false;
    isInstalling.value = false;
    
    // 如果下载失败，尝试使用浏览器下载
    message.value = "应用内下载失败，正在打开浏览器下载...";
    messageType.value = "warning";
    showMessage.value = true;
    
    // 打开浏览器下载
    setTimeout(() => {
      window.open("https://gitee.com/sh-lyj/xfm-crm-pro-vue3/releases/download/1.0.1/app-release1.0.1.apk", "_system");
      showUpdateDialog.value = false;
    }, 1500);
  }
};

// iOS跳转到App Store
const redirectToAppStore = async () => {
  const appStoreUrl = updateInfo.value.downloadInfo?.appStore?.url;
  if (appStoreUrl) {
    window.open(appStoreUrl, "_system");
  }
  showUpdateDialog.value = false;
};

// 显示更新弹框
const showUpdatePrompt = (updateData) => {
  updateInfo.value = updateData;
  showUpdateDialog.value = true;
  console.log("开始更新", updateData.url);
};

onMounted(async () => {
  /* 检测应用是否需要更新 */
  try {
    const platformUpdateData = await checkForUpdate();
    if (platformUpdateData.hasUpdate) {
      // 自动弹出更新弹框
      showUpdatePrompt(platformUpdateData);
    }
  } catch (error) {
    console.error("检查更新失败:", error);
  }
});
</script>
