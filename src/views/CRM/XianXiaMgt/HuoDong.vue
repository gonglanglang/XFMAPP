<template>
  <div class="simple-activity-page">
    <!-- 顶部导航栏 -->
    <XFMAPPHeader title-position="center" title="活动管理"> </XFMAPPHeader>

    <!-- 主容器 -->
    <div class="simple-container">
      <!-- 搜索和筛选栏 -->
      <div class="search-section">
        <div class="search-row">
          <var-input v-model="searchKeyword" placeholder="搜索活动名称..." clearable @input="debounceSearch" @clear="handleClearSearch" class="search-input">
            <template #prepend-icon>
              <var-icon name="magnify" />
            </template>
          </var-input>
        </div>
      </div>

      <!-- 活动列表 -->
      <div class="activity-list">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <var-loading type="wave" size="large" />
          <p>加载中...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="activities.length === 0" class="empty-container">
          <var-icon name="calendar-blank" size="60" color="#ccc" />
          <p class="empty-text">
            {{ searchKeyword || statusFilter ? "未找到符合条件的活动" : "暂无活动" }}
          </p>
        </div>

        <!-- 活动卡片列表 -->
        <div v-else>
          <div class="activity-cards">
            <div v-for="activity in activities" :key="activity.id" class="activity-card" @click="viewActivity(activity)">
              <!-- 卡片头部 -->
              <div class="card-header">
                <var-ellipsis class="font-bold"> {{ activity.activityName }} </var-ellipsis>
                <var-chip :type="getActivityTypeColor(activity.activityType)" size="small" plain>
                  {{ activity.activityType }}
                </var-chip>
              </div>

              <!-- 卡片内容 -->
              <div class="card-body">
                <div class="activity-info">
                  <div class="info-item">
                    <var-icon name="clock" size="16" color="#666" />
                    <span>{{ formatTime(activity.startTime, activity.endTime) }}</span>
                  </div>
                  <div class="info-item">
                    <var-icon name="map-marker" size="16" color="#666" />
                    <span>{{ activity.activityLocation }}</span>
                  </div>
                  <div class="info-item flex justify-between">
                    <div class="flex">
                      <var-icon name="account" size="16" color="#666" />
                      <span>{{ activity.creator }}</span>
                    </div>

                    <var-chip :type="getStatusColor(activity)" size="small">
                      {{ getActivityStatus(activity) }}
                    </var-chip>
                  </div>
                </div>
              </div>

              <!-- 卡片底部 -->
              <!-- <div class="card-footer">
                <var-chip :type="getStatusColor(activity)" size="small">
                  {{ getActivityStatus(activity) }}
                </var-chip>
              </div> -->
            </div>
          </div>

          <!-- 下拉加载更多 -->
          <div v-if="hasMore" class="load-more-container" ref="loadMoreRef">
            <div v-if="loadingMore" class="loading-more">
              <var-loading type="wave" size="small" />
              <span>加载更多...</span>
            </div>
            <div v-else class="load-more-trigger" @click="loadMore">
              <var-icon name="chevron-down" size="20" />
              <span>点击加载更多</span>
            </div>
          </div>

          <!-- 没有更多数据提示 -->
          <div v-else-if="activities.length > 0" class="no-more-data">
            <span>已加载全部数据</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <var-snackbar v-model:show="showMessage" :type="messageType" :duration="3000">
      {{ message }}
    </var-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";
import API from "@/API";

// 响应式数据
const activities = ref([]);
const searchKeyword = ref("");
const statusFilter = ref("");
const loading = ref(false);
const loadingMore = ref(false);
const showMessage = ref(false);
const message = ref("");
const messageType = ref("success");
const loadMoreRef = ref(null);

// 分页信息
const pagination = ref({
  total: 0,
  size: 20,
  current: 1,
  pages: 1,
});

// 计算是否还有更多数据
const hasMore = ref(true);

// 防抖搜索
let searchTimer = null;
const debounceSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    handleSearch();
  }, 500); // 500ms 防抖
};

// 获取活动列表
const fetchActivities = async (isLoadMore = false, keyword = "", status = "") => {
  if (isLoadMore) {
    loadingMore.value = true;
  } else {
    loading.value = true;
    activities.value = [];
    pagination.value.current = 1;
  }

  try {
    const params = {
      current: pagination.value.current,
      size: pagination.value.size,
    };

    // 如果有搜索关键词，添加到参数中
    if (keyword) {
      params.activityName = keyword; // 根据实际API参数名调整
    }

    // 如果有状态筛选，添加到参数中
    if (status) {
      params.status = status; // 根据实际API参数名调整
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

      // 判断是否还有更多数据
      hasMore.value = pagination.value.current < pagination.value.pages;
    } else {
      showMessageToast("获取活动列表失败", "error");
    }
  } catch (error) {
    console.error("获取活动列表错误:", error);
    showMessageToast("网络错误，请重试", "error");
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// 搜索处理
const handleSearch = () => {
  console.log("搜索关键词:", searchKeyword.value);
  fetchActivities(false, searchKeyword.value, statusFilter.value);
};

// 状态筛选处理
const handleStatusFilter = () => {
  console.log("状态筛选:", statusFilter.value);
  fetchActivities(false, searchKeyword.value, statusFilter.value);
};

// 清除搜索
const handleClearSearch = () => {
  searchKeyword.value = "";
  fetchActivities(false, "", statusFilter.value);
};

// 加载更多
const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return;

  pagination.value.current += 1;
  await fetchActivities(true, searchKeyword.value, statusFilter.value);
};

// 滚动监听加载更多
const handleScroll = () => {
  if (!loadMoreRef.value || loadingMore.value || !hasMore.value) return;

  const rect = loadMoreRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // 当加载更多区域进入视口时自动加载
  if (rect.top <= windowHeight + 100) {
    loadMore();
  }
};

// 查看活动详情
const viewActivity = (activity) => {
  console.log("查看活动:", activity);
  showMessageToast(`查看活动：${activity.activityName}`, "info");
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
  window.addEventListener("scroll", handleScroll);
});

// 组件卸载时清理
onUnmounted(() => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.simple-activity-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.simple-container {
  padding: 16px 10px;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* 搜索和筛选栏样式 */
.search-section {
  margin-bottom: 20px;
}

.search-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}

.status-filter {
  min-width: 120px;
  width: 150px;
}

/* 加载和空状态 */
.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.empty-text {
  margin-top: 16px;
  font-size: 16px;
}

/* 活动卡片列表 */
.activity-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.activity-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e9ecef;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.activity-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
  margin-right: 12px;
}

/* 卡片内容 */
.card-body {
  margin-bottom: 16px;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.info-item span {
  line-height: 1.4;
}

/* 卡片底部 */
.card-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 加载更多样式 */
.load-more-container {
  padding: 20px;
  text-align: center;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.load-more-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #1976d2;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  font-size: 14px;
}

.load-more-trigger:hover {
  background-color: #f5f5f5;
}

.no-more-data {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .simple-container {
    padding: 12px;
  }

  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    min-width: auto;
    max-width: none;
  }

  .status-filter {
    min-width: auto;
    width: 100%;
  }

  .activity-cards {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .activity-card {
    padding: 16px;
  }

  .activity-title {
    font-size: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .activity-title {
    margin-right: 0;
  }
}
</style>
