import { request } from "@/tools";

export default {
  /* 线下模块 - 活动管理 */
  APIAperationalSportActivityFind: (data) => request.post("/api-operational/sport/activity/find", data), // 获取活动列表
  APIAperationalActivityCustFindList: (data) => request.post("/api-operational/activity/cust/findList", data), // 获取活动客户列表

  /* 线下模块 - 动态列表 */
  APICustomerCustomerRecordsPage: (params) =>
    request.get("/api-customer/customer-records/page", {
      params,
    }), // 获取学员动态信息
  APICustomerCustomerRecords: (data) => request.post("/api-customer/customer-records", data), // 新增学员动态信息
};
