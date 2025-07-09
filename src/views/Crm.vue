<template>
  <div class="bg-gradient-to-br from-slate-50 to-slate-300 h-full flex flex-col">
    <!-- 添加XFMAPPHeader组件 -->
    <XFMAPPHeader class="flex-shrink-0 z-[1000]" title-position="center"> </XFMAPPHeader>

    <!-- 主要内容区域 -->
    <div class="flex-1 p-5 max-w-lg mx-auto overflow-y-auto w-full box-border sm:p-4">
      <var-collapse v-model="collapseValue" @change="handleChange">
        <var-collapse-item name="1" v-for="(model, index) in managementModule" :key="index">
          <template #title>
            <div class="flex items-center">
              <span class="text-[16px] text-[#555] font-bold">线下模块</span>
              <var-icon name="fire" class="ml-[5px]" />
            </div>
          </template>
          <template #default>
            <var-row :gutter="[10, 10]">
              <var-col :span="6" v-for="(app, appIndex) in model.values" :key="appIndex">
                <div class="flex flex-col">
                  <var-paper :elevation="2" :width="70" :height="70" ripple class="flex flex-col px-2 box-border justify-center items-center cursor-pointer" @click="navigateToApp(app)">
                    <svg class="w-[35px] h-[35px] mb-1" aria-hidden="true">
                      <use xlink:href="#icon-huodongguanli"></use>
                    </svg>
                    <var-ellipsis :tooltip="false"> {{ app.label }} </var-ellipsis>
                  </var-paper>
                </div>
              </var-col>
            </var-row>
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
import { ref } from "vue";
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
const managementModule = ref({
  eventManagement: {
    label: "线下模块",
    values: [
      {
        label: "活动管理",
        path: "/XianXia_HuoDong",
      },
    ],
  },
});

// 导航到应用页面
const navigateToApp = (app) => {
  try {
    if (app.path) {
      router.push(app.path);
      message.value = `正在跳转到${app.label}`;
      messageType.value = "info";
      showMessage.value = true;
    } else {
      message.value = "该功能暂未开放";
      messageType.value = "warning";
      showMessage.value = true;
    }
  } catch (error) {
    console.error("路由跳转失败:", error);
    message.value = "页面跳转失败";
    messageType.value = "error";
    showMessage.value = true;
  }
};

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
