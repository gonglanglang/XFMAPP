<template>
  <div class="profile-container">
    <div class="content-area">
      <var-card class="profile-card" elevation="2">
        <div class="text-center py-8 px-5">
          <var-icon name="account-circle" size="64" color="#3a7afe" class="mb-4" />
          <h2 class="text-xl font-semibold text-gray-800 mb-2">个人中心</h2>
          <p class="text-gray-600">{{ username }}</p>
        </div>
      </var-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const username = ref("");

onMounted(() => {
  username.value = localStorage.getItem("username") || "用户";
});
</script>

<style scoped>
.profile-container {
  min-height: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
}

.content-area {
  padding: 1.25rem;
  max-width: 32rem;
  margin: 0 auto;
}

.profile-card {
  background: white;
}
</style>
