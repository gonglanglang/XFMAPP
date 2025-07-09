import { request } from "@/tools";

export default {
  /* 线下模块 - 活动管理 */
  APIAperationalSportActivityFind: (data) => request.post("/api-operational/sport/activity/find", data), // 获取活动列表
};
