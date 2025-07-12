<template>
  <div class="h-full flex flex-col relative">
    <!-- 头部 -->
    <XFMAPPHeader class="flex-shrink-0 z-[1000]" title-position="center" title="动态信息"> </XFMAPPHeader>

    <!-- 主要内容区域 -->
    <div class="flex-1 p-2 max-w-lg mx-auto overflow-y-auto w-full box-border sm:p-4">
      <var-list v-model:loading="loading" v-model:finished="finished" :immediate-check="false" @load="loadMore" @refresh="refreshData" class="h-full">
        <!-- 动态列表 -->
        <div v-if="filteredDynamics.length > 0" class="space-y-3 p-2 sm:p-4">
          <var-paper v-for="dynamic in filteredDynamics" :key="dynamic.id" :elevation="2" class="p-4 hover:shadow-lg transition-shadow duration-200">
            <!-- 动态头部信息 -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <var-avatar size="32" class="bg-blue-500 text-white">
                  {{ dynamic.createdByName?.charAt(0) || "用" }}
                </var-avatar>
                <div>
                  <div class="font-medium text-sm">{{ dynamic.createdByName || dynamic.employeeName }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(dynamic.createdDate) }}</div>
                </div>
              </div>
              <var-chip size="small" type="primary" plain v-if="dynamic.activityName">
                {{ dynamic.activityName }}
              </var-chip>
            </div>

            <!-- 动态内容 -->
            <div class="mb-3">
              <p class="leading-relaxed">{{ dynamic.content }}</p>
            </div>

            <!-- 动态底部信息 -->
            <div class="flex items-center justify-between text-xs text-gray-400">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-1">
                  <var-icon name="identifier" size="12" />
                  <span>ID: {{ dynamic.id }}</span>
                </div>
                <div class="flex items-center space-x-1" v-if="dynamic.customerId">
                  <var-icon name="account" size="12" />
                  <span>客户ID: {{ dynamic.customerId.substring(0, 8) }}...</span>
                </div>
              </div>
              <div class="text-right">
                <span>{{ getRelativeTime(dynamic.createdDate) }}</span>
              </div>
            </div>
          </var-paper>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!loading && dynamicsData.records.length === 0" class="text-center py-16">
          <var-icon name="message-text-outline" size="48" color="#d1d5db" class="mb-4" />
          <h3 class="text-lg font-medium mb-2 text-gray-600">暂无动态信息</h3>
          <var-button type="primary" @click="refreshData">
            <var-icon name="refresh" />
            刷新
          </var-button>
        </div>

        <!-- 分页信息 -->
        <div v-if="dynamicsData.total > 0" class="mt-6 text-center text-sm text-gray-500 pb-4">已加载 {{ dynamicsData.records.length }} / {{ dynamicsData.total }} 条动态记录</div>

        <!-- 加载插槽 -->
        <template #loading>
          <div class="flex items-center justify-center gap-2 text-gray-600 text-sm py-4">
            <var-loading type="wave" size="small" />
            <span>加载中...</span>
          </div>
        </template>
      </var-list>
    </div>

    <!-- 右下角固定区域 -->
    <div class="fixed bottom-4 right-4 z-[999] flex flex-col items-end space-y-2">
      <!-- 添加动态按钮 -->
      <var-button type="primary" size="large" @click="addDynamic" class="shadow-lg transition-shadow duration-200">
        <var-icon name="plus" />
        添加动态
      </var-button>
    </div>

    <!-- 消息提示 -->
    <var-snackbar v-model:show="showMessage" :type="messageType" :duration="3000">
      {{ message }}
    </var-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";
import { useCacheStore } from "@/stores";
import { studentFields } from "./configuration";
import API from "@/API";

const router = useRouter();
const route = useRoute();
const cacheStore = useCacheStore();

// 响应式数据
const loading = ref(true);
const finished = ref(false); // var-list 需要的完成状态
const showMessage = ref(false);
const message = ref("");
const messageType = ref("success");

// 动态数据
const dynamicsData = ref({
  records: [],
  total: 0,
  size: 10,
  current: 1,
  pages: 1,
});

// 显示消息
const showNotification = (msg, type = "info") => {
  message.value = msg;
  messageType.value = type;
  showMessage.value = true;
};

// 计算属性 - 过滤动态数据
const filteredDynamics = computed(() => {
  return dynamicsData.value.records.filter((item) => !item.isDeleted);
});

// 加载更多数据 - var-list 的 @load 事件
const loadMore = async () => {
  if (finished.value) return;

  try {
    const nextPage = dynamicsData.value.current + 1;

    const response = await API?.APIXianXia.APICustomerCustomerRecordsPage({
      current: nextPage,
      size: dynamicsData.value.size,
      customerId: route.query.id,
    });

    if (response?.data) {
      const newData = response.data;

      // 合并新数据到现有记录中
      dynamicsData.value.records = [...dynamicsData.value.records, ...newData.records];
      dynamicsData.value.current = newData.current;
      dynamicsData.value.pages = newData.pages;
      dynamicsData.value.total = newData.total;

      // 检查是否已加载完所有数据
      if (dynamicsData.value.current >= dynamicsData.value.pages) {
        finished.value = true;
      }
      loading.value = false;
      console.log(`加载第${nextPage}页数据`, response);
    }
  } catch (error) {
    console.error("加载更多数据失败:", error);
    showNotification("加载更多数据失败", "error");
  }
};

// 刷新数据 - var-list 的 @refresh 事件
const refreshData = async () => {
  try {
    // 重置状态
    finished.value = false;
    dynamicsData.value.current = 1;

    const response = await API?.APIXianXia.APICustomerCustomerRecordsPage({
      current: 1,
      size: dynamicsData.value.size,
      customerId: route.query.id,
    });

    if (response?.data) {
      dynamicsData.value = response.data;

      // 检查是否只有一页数据
      if (dynamicsData.value.current >= dynamicsData.value.pages) {
        finished.value = true;
      }
    }

    loading.value = false;

    console.log("获取的动态信息", response);
  } catch (error) {
    console.error("刷新数据失败:", error);
    showNotification("刷新数据失败", "error");
  }
};

// 计算评论天数
const getCommentDays = (createdDate = "") => {
  if (!createdDate) return "--";
  // 获取最早的评论日期
  const earliestDate = createdDate;

  if (!earliestDate) return 0;

  // 计算从最早评论日期到今天的天数
  const today = new Date();
  const diffTime = today - earliestDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

// 添加动态
const addDynamic = () => {
  // 这里可以打开添加动态的弹窗或跳转到添加页面
  // showMessage.value = true;
  // message.value = "添加动态功能待实现";
  // messageType.value = "info";
  const formConfig = {
    title: "新增动态",
    initialData: {
      content: "",
    },
    submitText: "保存修改",
    fields: studentFields,
    onSubmit: async (formData) => {
      try {
        const params = {
          ...formData,
          customerId: route.query.id,
        };
        await API?.APIXianXia.APICustomerCustomerRecords(params);

        // 清除缓存数据
        cacheStore.clearAllCache();

        // 刷新列表
        refreshData();

        return true;
      } catch (error) {
        console.error("更新学员信息失败:", error);
        showNotification("更新失败，请重试", "error");
        return false;
      }
    },
  };
  cacheStore.setFormConfig(formConfig);
  // 实际实现可能是：
  router.push({
    name: "Edit",
    query: {
      id: route.query.id,
    },
  });
  // 或者打开一个弹窗组件
};

// 刷新数据
// const refreshData = async () => {
//   loading.value = true;
//   try {
//     // 这里应该调用实际的API接口
//     // 模拟API调用
//     const response = await API?.APIXianXia.APICustomerCustomerRecordsPage({
//       current: 1,
//       size: 10,
//       customerId: route.query.id,
//     });
//     dynamicsData.value = response?.data || {};
//     console.log("获取的动态信息", response);
//   } catch (error) {
//     console.error("刷新数据失败:", error);
//     showMessage.value = true;
//     message.value = "刷新数据失败";
//     messageType.value = "error";
//   } finally {
//     loading.value = false;
//   }
// };

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// 获取相对时间
const getRelativeTime = (dateString) => {
  if (!dateString) return "";

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 31) return `${diffDays}天前`;

  return formatDate(dateString).split(" ")[0]; // 返回日期部分
};

// 组件挂载时的初始化
onMounted(() => {
  refreshData();
});
</script>

<style scoped>
/* 如果需要自定义样式，可以在这里添加 */
.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}
</style>
