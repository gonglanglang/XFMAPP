import { request } from "@/tools";

const APP = {
  APICloudConfigurationAppCheckVersion: (data) => request.post("/api-cloudConfiguration/app/checkVersion", data), // 获取APP版本信息
};

export default APP;
