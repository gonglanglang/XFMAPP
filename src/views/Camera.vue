<template>
  <div class="camera-container">
    <div class="content-area">
      <var-card class="camera-card" elevation="2">
        <div class="text-center py-8 px-5">
          <var-icon name="camera" size="64" color="#3a7afe" class="mb-4" />
          <h2 class="text-xl font-semibold text-gray-800 mb-4">拍照功能</h2>
          <var-button type="primary" size="large" @click="takePhoto">
            <var-icon name="camera" />
            开始拍照
          </var-button>
        </div>
      </var-card>
    </div>
  </div>
</template>

<script setup>
import { Camera } from "@capacitor/camera";
import { Snackbar } from "@varlet/ui";

const takePhoto = async () => {
  try {
    const photo = await Camera.getPhoto({
      resultType: "uri",
    });
    Snackbar.success("照片拍摄成功！");
  } catch (error) {
    Snackbar.warning("拍照已取消");
  }
};
</script>

<style scoped>
.camera-container {
  min-height: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
}

.content-area {
  padding: 1.25rem;
  max-width: 32rem;
  margin: 0 auto;
}

.camera-card {
  background: white;
}
</style>
