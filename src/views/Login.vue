<template>
  <div class="login-container">
    <var-paper :elevation="2" class="p-10 w-full max-w-sm">
      <!-- Logo 区域 -->
      <div class="text-center mb-8">
        <var-icon name="account-circle" size="64" color="#1976d2" />
        <h1 class="text-2xl font-semibold mt-4 mb-2">幸福美 CRM</h1>
        <!-- <p class="text-slate-500 text-sm m-0">请输入您的账号信息</p> -->
      </div>
      <!-- 登录表单 -->
      <var-form ref="form" :disabled="loading">
        <var-space direction="column" size="large">
          <var-input v-model="loginForm.username" placeholder="请输入用户名" :rules="usernameRules" clearable>
            <template #prepend-icon>
              <var-icon name="account" />
            </template>
          </var-input>

          <var-input v-model="loginForm.password" type="password" placeholder="请输入密码" :rules="passwordRules" clearable>
            <template #append-icon>
              <var-icon name="lock" />
            </template>
          </var-input>

          <var-checkbox v-model="loginForm.remember"> 记住密码 </var-checkbox>

          <var-button type="primary" block :loading="loading" @click="handleLogin"> 登录 </var-button>
        </var-space>
      </var-form>

      <!-- 底部链接 -->
      <div class="flex items-center justify-center mt-6 gap-2">
        <var-button text type="primary" size="small"> 忘记密码？ </var-button>
        <var-divider vertical />
        <var-button text type="primary" size="small"> 注册账号 </var-button>
      </div>
    </var-paper>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Snackbar } from "@varlet/ui";

// 方法引入
import API from "@/API/index.js";
import { Rsa } from "@/tools";
import { useUserStore } from "@/stores";

// 定义pinia
const useUser = useUserStore();

const router = useRouter();
const form = ref();
const loading = ref(false);

// 登录表单数据
const loginForm = reactive({
  username: "19328778824",
  password: "xfm1024",
  remember: false,
});

// 表单验证规则
const usernameRules = [(v) => !!v || "请输入用户名", (v) => v.length >= 3 || "用户名至少3个字符"];

const passwordRules = [(v) => !!v || "请输入密码", (v) => v.length >= 6 || "密码至少6个字符"];

// 登录处理
const handleLogin = async () => {
  const valid = await form.value?.validate();
  if (!valid) return;

  loading.value = true;

  try {
    const rsa = new Rsa();
    console.log("提交参数", rsa.encrypt(loginForm.password));
    // 模拟登录API调用
    const params = {
      password: await rsa.encrypt(loginForm.password),
      phone: loginForm.username,
      // loginType: "APP",
    };
    const { data } = await API?.APILogin?.APIAuthAuthLogin(params);
    console.log("请求到的数据", data);
    useUser.setUserInfo(data);
    Snackbar.success("登录成功！");
    setTimeout(() => {
      router.push("/");
    }, 500);
  } catch (error) {
    Snackbar.error("登录失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 页面加载时检查是否有记住的用户名
const rememberedUsername = localStorage.getItem("rememberedUsername");
if (rememberedUsername) {
  loginForm.username = rememberedUsername;
  loginForm.remember = true;
}

onMounted(() => {
  console.log("登录方法", API);
});
</script>

<style scoped>
.login-container {
  /* 固定高度为100vh，防止滚动 */
  height: 100vh;
  height: 100dvh; /* 动态视口高度，更准确 */

  /* 安全区适配 */
  padding-top: max(1.25rem, env(safe-area-inset-top));
  padding-bottom: max(1.25rem, env(safe-area-inset-bottom));
  padding-left: max(1.25rem, env(safe-area-inset-left));
  padding-right: max(1.25rem, env(safe-area-inset-right));

  /* 布局 */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 背景 */
  /* background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%); */

  /* 防止滚动 */
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .login-container {
    padding: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
  }
}
</style>
