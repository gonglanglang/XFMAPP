<template>
  <div class="h-full flex flex-col">
    <!-- 头部 -->
    <XFMAPPHeader class="flex-shrink-0 z-[1000]" title-position="center"> </XFMAPPHeader>

    <!-- 主要内容区域 -->
    <div class="flex-1 p-2 max-w-lg mx-auto overflow-y-auto w-full box-border sm:p-4">
      <!-- 搜索栏 -->
      <div class="mb-4">
        <var-input v-model="searchKeyword" placeholder="搜索学员姓名" clearable @input="handleSearch" class="rounded-2xl">
          <template #prepend-icon>
            <var-icon name="magnify" color="#9ca3af" />
          </template>
        </var-input>
      </div>

      <!-- 活动信息卡片 -->
      <var-paper ripple :elevation="2" class="mb-4 p-4">
        <!-- <var-cell>纸张</var-cell>
        <var-cell>纸张</var-cell>
        <var-cell>纸张</var-cell> -->
        <div class="flex items-start space-x-3">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center">
            <svg class="w-8 h-8 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600" aria-hidden="true">
              <use xlink:href="#icon-huodongguanli"></use>
            </svg>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold mb-2">{{ activityInfo.activityName || "活动标题" }}</h2>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <var-icon name="calendar" size="16" color="#6b7280" />
                <span class="text-sm">创建时间：{{ formatDate(activityInfo.createdTime) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <var-icon name="calendar" size="16" color="#6b7280" />
                <span class="text-sm">活动描述：{{ activityInfo.activityDescription || "暂无活动描述" }}</span>
              </div>
            </div>
          </div>
        </div>
      </var-paper>

      <!-- 学员列表 -->
      <div class="space-y-3" ref="listContainer">
        <var-paper v-for="(student, index) in studentData.records" :key="student.id || index" ripple :elevation="2" class="p-4 cursor-pointer" @click="editStudent(student)">
          <!-- 学员信息行 -->
          <div class="flex items-center space-x-3 mb-3">
            <!-- 头像 -->
            <!-- <div class="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
              {{ getInitials(student.custName) }}
            </div> -->

            <!-- 基本信息 -->
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-1">
                {{ student.custName || "未知学员" }}
              </h3>
              <div class="flex items-center space-x-4 text-sm">
                <div class="flex items-center space-x-1">
                  <var-icon name="phone" size="14" />
                  <span>{{ student.custPhone }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <var-icon name="identifier" size="14" />
                  <span>ID: {{ student.id }}</span>
                </div>
              </div>
            </div>

            <!-- 编辑图标 -->
            <div class="text-gray-400 hover:text-blue-500 transition-colors">
              <var-icon name="pencil" size="20" />
            </div>
          </div>

          <!-- 活动信息 -->
          <var-cell>
            <h4 class="font-medium text-sm mb-1">参与活动</h4>
            <p class="text-sm leading-relaxed">
              {{ student.activityName || "暂无活动信息" }}
            </p>
          </var-cell>

          <var-cell>
            <h4 class="font-medium text-sm mb-1">现场组别</h4>
            <p class="text-sm leading-relaxed">
              {{ student.sceneGroup || "暂无现场组别" }}
            </p>
          </var-cell>
        </var-paper>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-15 px-5">
        <var-loading type="wave" size="large" />
        <p>加载中...</p>
      </div>

      <!-- 没有更多数据提示 -->
      <div v-else-if="!hasMore && studentData.records.length > 0" class="mt-6 text-center py-4">
        <span class="text-sm text-gray-400">已加载全部数据</span>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!studentData.records || studentData.records.length === 0" class="text-center py-16">
        <h3 class="text-lg font-medium mb-2">暂无学员数据</h3>
        <p class="text-gray-400 mb-6">当前没有找到任何学员信息</p>
        <var-button type="primary" @click="refreshData" round>
          <var-icon name="refresh" />
        </var-button>
      </div>
    </div>

    <!-- 消息提示 -->
    <var-snackbar v-model:show="showMessage" :type="messageType" :duration="3000" position="top">
      {{ message }}
    </var-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";
import API from "@/API";
import { useCacheStore } from "@/stores";
import { studentFields } from "./configuration.js";

const router = useRouter();
const route = useRoute();

// 定义Pinia存储
const cacheStore = useCacheStore();

// 响应式数据
const loading = ref(false);
const loadingMore = ref(false);
const searchKeyword = ref("");
const showMessage = ref(false);
const message = ref("");
const messageType = ref("success");
const listContainer = ref(null);
const hasMore = ref(true);

// 活动信息 - 从路由参数获取
const activityInfo = ref({
  activityId: route.query.activityId || "",
  activityName: route.query.activityName || "活动标题",
  createdTime: route.query.createdTime || "",
  activityDescription: route.query.activityDescription || "暂无活动描述",
});

// 学员数据
const studentData = ref({
  records: [],
  total: 0,
  size: 10,
  current: 1,
  pages: 1,
});

// 编辑学员信息
const editStudent = (student) => {
  // 创建表单配置，直接在配置中包含初始数据
  // const formConfig = {
  //   title: "编辑学员信息",
  //   initialData: student, // 直接在配置中包含初始数据
  //   fields: studentFields,
  //   submitText: "保存修改",
  //   onSubmit: async (formData) => {
  //     try {
  //       console.log("更新学员信息:", formData);
  //       showNotification("学员信息更新成功", "success");

  //       // 清除缓存数据
  //       cacheStore.clearAllCache();

  //       // 刷新列表
  //       refreshData();

  //       return true;
  //     } catch (error) {
  //       console.error("更新学员信息失败:", error);
  //       showNotification("更新失败，请重试", "error");
  //       return false;
  //     }
  //   },
  // };

  // 只设置表单配置和返回路径
  // cacheStore.setFormConfig(formConfig);
  // 初始数据,
  console.log("学员信息", student);
  // 跳转到编辑页面
  router.push({
    name: "XianXia_HuoDong_dynamics",
    query: {
      id: student.custId,
    },
  });
};

// 获取学员列表
const fetchStudentList = async (params = {}, isLoadMore = false) => {
  try {
    if (isLoadMore) {
      loadingMore.value = true;
    } else {
      loading.value = true;
    }

    const response = await API?.APIXianXia.APIAperationalActivityCustFindList({
      current: studentData.value.current,
      size: studentData.value.size,
      activityId: activityInfo.value.activityId,
      ...params,
    });

    if (response.code === 200) {
      if (isLoadMore) {
        // 追加数据
        studentData.value.records = [...studentData.value.records, ...response.data.records];
        studentData.value.current = response.data.current;
        studentData.value.pages = response.data.pages;
        studentData.value.total = response.data.total;
      } else {
        // 替换数据
        studentData.value = response.data;
      }

      // 检查是否还有更多数据
      hasMore.value = studentData.value.current < studentData.value.pages;

      // if (!isLoadMore) {
      //   showNotification("数据加载成功", "success");
      // }
    } else {
      showNotification(response.msg || "获取数据失败", "error");
    }
  } catch (error) {
    console.error("获取学员列表失败:", error);
    showNotification("网络错误，请重试", "error");
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// 加载更多数据
const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return;

  studentData.value.current += 1;
  await fetchStudentList({}, true);
};

// 滚动事件处理
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // 当滚动到距离底部100px时触发加载更多
  if (scrollTop + windowHeight >= documentHeight - 100) {
    loadMore();
  }
};

// 搜索处理
const handleSearch = () => {
  studentData.value.current = 1;
  studentData.value.records = [];
  hasMore.value = true;

  if (searchKeyword.value.trim()) {
    fetchStudentList({ custName: searchKeyword.value.trim() });
  } else {
    fetchStudentList();
  }
};

// 刷新数据
const refreshData = () => {
  searchKeyword.value = "";
  studentData.value.current = 1;
  studentData.value.records = [];
  hasMore.value = true;
  fetchStudentList();
};

// 工具函数
const getInitials = (name) => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

const formatPhone = (phone) => {
  if (!phone) return "暂无电话";
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
};

const formatDate = (dateStr) => {
  if (!dateStr) return "待定";
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return "暂无";
  const date = new Date(dateTime);
  return date.toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  });
};

const formatDateRange = (startTime, endTime) => {
  if (!startTime || !endTime) return "时间待定";
  const start = new Date(startTime).toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  });
  const end = new Date(endTime).toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  });
  return `${start} - ${end}`;
};

const showNotification = (msg, type = "info") => {
  message.value = msg;
  messageType.value = type;
  showMessage.value = true;
};

// 生命周期
onMounted(() => {
  fetchStudentList();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
