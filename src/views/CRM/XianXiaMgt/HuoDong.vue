<template>
  <div class="h-full flex flex-col">
    <!-- 顶部导航栏 -->
    <XFMAPPHeader title-position="center" title="活动管理"> </XFMAPPHeader>

    <!-- 主容器 -->
    <div class="px-2.5 py-4 box-border flex-1">
      <!-- 搜索和筛选栏 -->
      <div class="mb-5">
        <div class="flex gap-3 items-center flex-wrap">
          <var-input v-model="searchKeyword" placeholder="搜索活动名称..." clearable @input="debounceSearch" @clear="handleClearSearch" class="flex-1 min-w-[250px] max-w-[400px]">
            <template #prepend-icon>
              <var-icon name="magnify" />
            </template>
          </var-input>
        </div>
      </div>

      <!-- 活动列表 -->
      <div class="w-full flex-1">
        <var-list v-model:loading="loading" v-model:finished="finished" :immediate-check="false" @load="loadMore" @refresh="refreshData" class="h-full">
          <!-- 空状态 -->
          <div v-if="activities.length === 0 && !loading" class="flex flex-col items-center justify-center py-15 px-5">
            <var-icon name="calendar-blank" size="60" color="#ccc" />
            <p class="mt-4 text-base">
              {{ searchKeyword || statusFilter ? "未找到符合条件的活动" : "暂无活动" }}
            </p>
          </div>

          <!-- 活动卡片列表 -->
          <div v-else-if="activities.length > 0">
            <div class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 mb-5">
              <var-paper v-for="activity in activities" :key="activity.id" class="p-5" :elevation="2" ripple @click="viewActivity(activity)">
                <!-- 卡片头部 -->
                <div class="flex justify-between items-start mb-4">
                  <var-ellipsis class="font-bold flex-1 mr-3"> {{ activity.activityName }} </var-ellipsis>
                  <var-chip :type="getActivityTypeColor(activity.activityType)" size="small" class="whitespace-nowrap" plain>
                    {{ activity.activityType }}
                  </var-chip>
                </div>

                <!-- 卡片内容 -->
                <div class="mb-4">
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2 text-sm">
                      <var-icon name="clock" size="16" color="#666" />
                      <span class="leading-relaxed">{{ formatTime(activity.startTime, activity.endTime) }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                      <var-icon name="map-marker" size="16" color="#666" />
                      <span class="leading-relaxed">{{ activity.activityLocation }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <div class="flex items-center gap-2">
                        <var-icon name="account" size="16" color="#666" />
                        <span class="leading-relaxed">{{ activity.creator }}</span>
                      </div>

                      <var-chip :type="getStatusColor(activity)" size="small">
                        {{ getActivityStatus(activity) }}
                      </var-chip>
                    </div>
                  </div>
                </div>
              </var-paper>
            </div>
          </div>

          <!-- 自定义加载插槽 -->
          <template #loading>
            <div class="flex items-center justify-center gap-2 text-gray-600 text-sm py-4">
              <var-loading type="wave" size="small" />
              <span>加载中...</span>
            </div>
          </template>

          <!-- 自定义完成插槽 -->
          <template #finished>
            <div class="text-center p-5 text-gray-400 text-sm">
              <span>已加载全部数据</span>
            </div>
          </template>
        </var-list>
      </div>
    </div>

    <!-- 消息提示 -->
    <var-snackbar v-model:show="showMessage" :type="messageType" :duration="3000">
      {{ message }}
    </var-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";
import API from "@/API";
import { useRouter } from "vue-router";

const router = useRouter();

// 响应式数据
const activities = ref([]);
const searchKeyword = ref("");
const statusFilter = ref("");
const loading = ref(true);
const finished = ref(false); // var-list 需要的完成状态
const showMessage = ref(false);
const message = ref("");
const messageType = ref("success");

// 分页信息
const pagination = ref({
  total: 0,
  size: 20,
  current: 1,
  pages: 1,
});

// 防抖搜索
let searchTimer = null;
const debounceSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    handleSearch();
  }, 500);
};

// 获取活动列表
const fetchActivities = async (isLoadMore = false, keyword = "", status = "") => {
  try {
    const params = {
      current: isLoadMore ? pagination.value.current + 1 : 1,
      size: pagination.value.size,
    };

    // 如果有搜索关键词，添加到参数中
    if (keyword) {
      params.activityName = keyword;
    }

    // 如果有状态筛选，添加到参数中
    if (status) {
      params.status = status;
    }

    const response = await API?.APIXianXia?.APIAperationalSportActivityFind(params);

    if (response.code === 200) {
      const newData = response.data.records || [];

      if (isLoadMore) {
        // 加载更多时追加数据
        activities.value = [...activities.value, ...newData];
      } else {
        // 首次加载或搜索时替换数据
        activities.value = newData;
      }

      pagination.value = {
        total: response.data.total,
        size: response.data.size,
        current: response.data.current,
        pages: response.data.pages,
      };

      // 检查是否已加载完所有数据
      if (pagination.value.current >= pagination.value.pages) {
        finished.value = true;
      } else {
        finished.value = false;
      }
    } else {
      showMessageToast("获取活动列表失败", "error");
    }
    loading.value = false;
  } catch (error) {
    console.error("获取活动列表错误:", error);
    showMessageToast("网络错误，请重试", "error");
  }
};

// 加载更多数据 - var-list 的 @load 事件
const loadMore = async () => {
  if (finished.value) return;
  await fetchActivities(true, searchKeyword.value, statusFilter.value);
};

// 刷新数据 - var-list 的 @refresh 事件
const refreshData = async () => {
  finished.value = false;
  pagination.value.current = 1;
  await fetchActivities(false, searchKeyword.value, statusFilter.value);
};

// 搜索处理
const handleSearch = () => {
  console.log("搜索关键词:", searchKeyword.value);
  finished.value = false;
  pagination.value.current = 1;
  fetchActivities(false, searchKeyword.value, statusFilter.value);
};

// 状态筛选处理
const handleStatusFilter = () => {
  console.log("状态筛选:", statusFilter.value);
  finished.value = false;
  pagination.value.current = 1;
  fetchActivities(false, searchKeyword.value, statusFilter.value);
};

// 清除搜索
const handleClearSearch = () => {
  searchKeyword.value = "";
  finished.value = false;
  pagination.value.current = 1;
  fetchActivities(false, "", statusFilter.value);
};

// 查看活动详情
const viewActivity = (activity) => {
  // console.log("查看活动:", activity);
  // showMessageToast(`查看活动：${activity.activityName}`, "info");
  router.push({
    name: "XianXia_HuoDong_Info",
    query: {
      activityId: activity.id,
      activityName: activity.activityName,
      createdTime: activity.createdTime,
      activityDescription: activity.activityDescription,
    },
  });
};

// 获取活动状态
const getActivityStatus = (activity) => {
  const now = new Date();
  const start = new Date(activity.startTime);
  const end = new Date(activity.endTime);

  if (now < start) return "未开始";
  if (now > end) return "已结束";
  return "进行中";
};

// 获取状态颜色
const getStatusColor = (activity) => {
  const status = getActivityStatus(activity);
  switch (status) {
    case "进行中":
      return "success";
    case "已结束":
      return "default";
    case "未开始":
      return "warning";
    default:
      return "default";
  }
};

// 获取活动类型颜色
const getActivityTypeColor = (type) => {
  switch (type) {
    case "幸福道":
      return "primary";
    case "健康道":
      return "success";
    default:
      return "default";
  }
};

// 格式化时间
const formatTime = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatTime = (date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  if (start.toDateString() === end.toDateString()) {
    return `${formatDate(start)} ${formatTime(start)}-${formatTime(end)}`;
  } else {
    return `${formatDate(start)} ${formatTime(start)} - ${formatDate(end)} ${formatTime(end)}`;
  }
};

// 显示消息提示
const showMessageToast = (msg, type = "success") => {
  message.value = msg;
  messageType.value = type;
  showMessage.value = true;
};

// 组件挂载时获取数据
onMounted(() => {
  fetchActivities();
  // 添加滚动监听
  // window.addEventListener("scroll", handleScroll);
});

// 组件卸载时清理
onUnmounted(() => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  // window.removeEventListener("scroll", handleScroll);
});
</script>
