import { request } from "@/tools";

export default {
  /* 登录模块 */
  APIAuthAuthLogin: (data) => request.post("/api-auth/auth/login", data), // 用户登录
  APIAuthAuthLogout: (data) => request.post("/api-auth/auth/logout", data), // 用户退出
};
