import { CapacitorHttp } from "@capacitor/core";
import { Snackbar } from "@varlet/ui";

// 检查是否在原生环境
const isNative = () => {
  return window.Capacitor && window.Capacitor.isNativePlatform();
};

// 根据环境动态设置baseURL
const getBaseURL = () => {
  if (isNative()) {
    // 生产环境API地址
    return "https://crm.beautyedutech.com";
  } else {
    // 开发环境使用代理
    return "/agent";
  }
};

// 统一的请求处理函数
const makeRequest = async (method, url, data = null, config = {}) => {
  const baseURL = getBaseURL();
  const fullUrl = `${baseURL}${url}`;

  // 默认headers
  const defaultHeaders = {
    "Content-Type": "application/json;charset=UTF-8",
  };

  // 合并headers
  const headers = {
    ...defaultHeaders,
    ...config.headers,
  };

  // 添加时间戳防止缓存（GET请求）
  let finalUrl = fullUrl;
  if (method.toLowerCase() === "get") {
    const separator = fullUrl.includes("?") ? "&" : "?";
    finalUrl = `${fullUrl}${separator}_t=${Date.now()}`;
    if (data) {
      // GET请求将data转换为查询参数
      const params = new URLSearchParams(data).toString();
      finalUrl = `${finalUrl}&${params}`;
    }
  }

  console.log(`${method.toUpperCase()}请求发送:`, {
    url: finalUrl,
    headers,
    data: method.toLowerCase() !== "get" ? data : null,
    isNative: isNative(),
  });

  try {
    let response;

    if (isNative()) {
      // 原生环境使用 Capacitor HTTP
      const requestOptions = {
        url: finalUrl,
        headers,
        ...(config.timeout && { readTimeout: config.timeout, connectTimeout: config.timeout }),
      };

      if (method.toLowerCase() !== "get" && data) {
        requestOptions.data = data;
      }

      switch (method.toLowerCase()) {
        case "get":
          response = await CapacitorHttp.get(requestOptions);
          break;
        case "post":
          response = await CapacitorHttp.post(requestOptions);
          break;
        case "put":
          response = await CapacitorHttp.put(requestOptions);
          break;
        case "delete":
          response = await CapacitorHttp.delete(requestOptions);
          break;
        case "patch":
          response = await CapacitorHttp.patch(requestOptions);
          break;
        default:
          throw new Error(`不支持的请求方法: ${method}`);
      }

      // Capacitor HTTP 返回的数据结构
      const responseData = response.data;

      console.log("原生环境响应接收:", response);

      // 处理响应状态
      if (response.status === 200) {
        if (responseData.code === 200 || responseData.success === true) {
          return responseData;
        } else {
          const message = responseData.message || responseData.msg || "请求失败";
          Snackbar.error(message);
          throw new Error(message);
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.data}`);
      }
    } else {
      // 浏览器环境使用 fetch API
      const fetchOptions = {
        method: method.toUpperCase(),
        headers,
        ...(config.timeout && { signal: AbortSignal.timeout(config.timeout) }),
      };

      if (method.toLowerCase() !== "get" && data) {
        fetchOptions.body = JSON.stringify(data);
      }

      response = await fetch(finalUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      console.log("浏览器环境响应接收:", {
        status: response.status,
        data: responseData,
      });

      // 处理响应数据
      if (responseData.code === 200 || responseData.success === true) {
        return responseData;
      } else {
        const message = responseData.message || responseData.msg || "请求失败";
        Snackbar.error(message);
        throw new Error(message);
      }
    }
  } catch (error) {
    console.error(`${method.toUpperCase()}请求错误:`, error);

    let message = "网络错误";

    if (error.name === "TimeoutError") {
      message = "请求超时";
    } else if (error.message.includes("Network Error") || error.message.includes("Failed to fetch")) {
      message = "网络连接异常";
    } else if (error.message.includes("HTTP")) {
      // 解析HTTP错误状态码
      const statusMatch = error.message.match(/HTTP (\d+)/);
      if (statusMatch) {
        const status = parseInt(statusMatch[1]);
        switch (status) {
          case 400:
            message = "请求参数错误";
            break;
          case 401:
            message = "未授权，请重新登录";
            // 清除token并跳转到登录页
            localStorage.removeItem("token");
            break;
          case 403:
            message = "拒绝访问";
            break;
          case 404:
            message = "请求地址不存在";
            break;
          case 500:
            message = "服务器内部错误";
            break;
          default:
            message = `连接错误${status}`;
        }
      }
    } else if (error.message && error.message !== "网络错误") {
      message = error.message;
    }

    Snackbar.error(message);
    throw error;
  }
};

// 创建service对象，保持与原axios实例相同的API
const service = {
  get: (url, config = {}) => makeRequest("get", url, config.params, config),
  post: (url, data, config = {}) => makeRequest("post", url, data, config),
  put: (url, data, config = {}) => makeRequest("put", url, data, config),
  delete: (url, config = {}) => makeRequest("delete", url, config.params, config),
  patch: (url, data, config = {}) => makeRequest("patch", url, data, config),

  // 添加请求和响应拦截器的兼容方法（简化版）
  interceptors: {
    request: {
      use: (successHandler, errorHandler) => {
        console.log("请求拦截器已注册（简化实现）");
        // 注意：这里是简化实现，实际的拦截器逻辑已经内置在makeRequest中
      },
    },
    response: {
      use: (successHandler, errorHandler) => {
        console.log("响应拦截器已注册（简化实现）");
        // 注意：这里是简化实现，实际的拦截器逻辑已经内置在makeRequest中
      },
    },
  },
};

export default service;
