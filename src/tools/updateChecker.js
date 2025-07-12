import { Device } from "@capacitor/device";
import { App } from "@capacitor/app";
import { useAppStore } from "@/stores";
import API from "@/API";

// 模拟数据 - 用于静态接口测试
const mockUpdateData = {
  android: {
    hasUpdate: true,
    version: "1.1.0",
    title: "重要更新",
    description: "1. 修复了重要的安全漏洞\n2. 优化了应用性能\n3. 新增了数据同步功能\n4. 修复了已知bug",
    forceUpdate: false,
    updateTime: "2024-01-15T10:00:00Z",
    fileSize: 25600000,
    platform: "android",
    downloadInfo: {
      directDownload: {
        url: "https://cdn.example.com/xfmCrmApp-v1.1.0.apk",
        fileSize: 25600000,
        md5: "abc123def456789",
      },
      playStore: {
        url: "https://play.google.com/store/apps/details?id=com.xinfumei.com",
        packageName: "com.xinfumei.com",
      },
    },
    minOsVersion: "6.0",
  },
  ios: {
    hasUpdate: true,
    version: "1.1.0",
    title: "重要更新",
    description: "1. 修复了重要的安全漏洞\n2. 优化了应用性能\n3. 新增了数据同步功能\n4. 修复了已知bug",
    forceUpdate: false,
    updateTime: "2024-01-15T10:00:00Z",
    platform: "ios",
    downloadInfo: {
      appStore: {
        url: "https://apps.apple.com/app/idXXXXXXXX",
        appId: "XXXXXXXXX",
      },
    },
    minOsVersion: "12.0",
  },
  web: {
    hasUpdate: false,
    version: "1.0.0",
    platform: "web",
  },
};

// 版本比较函数
export function compareVersion(version1, version2) {
  const v1Parts = version1.split(".").map(Number);
  const v2Parts = version2.split(".").map(Number);

  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }

  return 0;
}

// 检查更新
export const checkForUpdate = async () => {
  try {
    // 获取设备信息
    const deviceInfo = await Device.getInfo();
    const appInfo = await App.getInfo();

    // 定义应用状态
    const useApp = useAppStore();

    // 构建请求数据
    const requestData = {
      currentVersion: appInfo.version,
      buildNumber: appInfo.build,
      platform: deviceInfo.platform,
      osVersion: deviceInfo.osVersion,
      deviceModel: deviceInfo.model,
      manufacturer: deviceInfo.manufacturer,
      packageName: appInfo.id,
    };

    useApp.setConfig(requestData); // 更新版本信息

    // 获取服务器版本信息
    const params = {
      platform: requestData.platform.toLocaleUpperCase(),
      version: requestData.currentVersion,
    };

    const ossResout = await API?.APIUpdate.APICloudConfigurationAppCheckVersion(params);
    Object.assign(ossResout.data, {
      hasUpdate: compareVersion(requestData.currentVersion, ossResout.data.version) < 0,
    });

    console.log("服务器返回版本信息", ossResout.data);
    if (ossResout.code === 200) {
      if (ossResout.data.hasUpdate) {
        // 有更新
        return ossResout.data;
      } else {
        // 无更新
        return {
          hasUpdate: false,
        };
      }
    } else {
      // 无更新
      return {
        hasUpdate: false,
      };
    }
    // const updateData = mockUpdateData[requestData.platform];
    // 模拟版本比较逻辑
    // const hasUpdate = compareVersion(requestData.currentVersion || "1.0.0", updateData.version) < 0;
  } catch (error) {
    console.error("检查更新失败:", error);
    throw error;
  }
};
