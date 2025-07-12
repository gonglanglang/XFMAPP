<template>
  <div class="h-full flex flex-col">
    <!-- 头部 -->
    <XFMAPPHeader class="flex-shrink-0 z-[1000]" title-position="center">
      <template #title>
        {{ formConfig.title || "编辑表单" }}
      </template>
      <template #left>
        <var-button text @click="handleBack">
          <var-icon name="chevron-left" size="24" />
        </var-button>
      </template>
    </XFMAPPHeader>

    <!-- 主要内容区域 -->
    <div class="flex-1 p-4 max-w-lg mx-auto overflow-y-auto w-full">
      <var-form ref="form" v-if="formConfig.fields">
        <div class="space-y-4">
          <var-paper :elevation="2" ripple v-for="field in formConfig.fields" :key="field.key" class="p-4">
            <!-- 字段标签 -->
            <div v-if="field.type !== 'checkbox' && field.type !== 'switch'" class="text-sm mb-2">
              {{ field.label }}
              <span v-if="field.validation?.required" class="text-red-500 ml-1">*</span>
            </div>

            <!-- 输入框 -->
            <var-input v-if="field.type === 'input'" v-model="formData[field.key]" :placeholder="field.placeholder || `请输入${field.label}`" :rules="getFieldRules(field)" clearable>
              <template #prepend-icon>
                <var-icon :name="field.icon || 'form-textbox'" color="#6b7280" />
              </template>
            </var-input>

            <!-- 密码框 -->
            <var-input v-else-if="field.type === 'password'" v-model="formData[field.key]" type="password" :placeholder="field.placeholder || `请输入${field.label}`" :rules="getFieldRules(field)" clearable>
              <template #prepend-icon>
                <var-icon :name="field.icon || 'lock'" color="#6b7280" />
              </template>
            </var-input>

            <!-- 数字输入框 -->
            <var-input v-else-if="field.type === 'number'" v-model.number="formData[field.key]" type="number" :placeholder="field.placeholder || `请输入${field.label}`" :rules="getFieldRules(field)" clearable>
              <template #prepend-icon>
                <var-icon :name="field.icon || 'numeric'" color="#6b7280" />
              </template>
            </var-input>

            <!-- 选择框 -->
            <var-select v-else-if="field.type === 'select'" v-model="formData[field.key]" :placeholder="field.placeholder || `请选择${field.label}`" :rules="getFieldRules(field)">
              <var-option v-for="option in field.options" :key="option.value" :label="option.label" :value="option.value" />
            </var-select>

            <!-- 复选框 -->
            <var-checkbox v-else-if="field.type === 'checkbox'" v-model="formData[field.key]" :rules="getFieldRules(field)">
              {{ field.label }}
            </var-checkbox>

            <!-- 开关 -->
            <div v-else-if="field.type === 'switch'" class="flex items-center justify-between">
              <span class="text-gray-700">{{ field.label }}</span>
              <var-switch v-model="formData[field.key]" :rules="getFieldRules(field)" />
            </div>

            <!-- 文本域 -->
            <var-input v-else-if="field.type === 'textarea'" v-model="formData[field.key]" textarea :placeholder="field.placeholder || `请输入${field.label}`" :rules="getFieldRules(field)" :rows="field.rows || 3" clearable />

            <!-- 日期选择 -->
            <var-date-picker v-else-if="field.type === 'date'" v-model="formData[field.key]" :placeholder="field.placeholder || `请选择${field.label}`" :rules="getFieldRules(field)" />

            <!-- 时间选择 -->
            <var-time-picker v-else-if="field.type === 'time'" v-model="formData[field.key]" :placeholder="field.placeholder || `请选择${field.label}`" :rules="getFieldRules(field)" />

            <!-- 日期时间选择 -->
            <var-date-picker v-else-if="field.type === 'datetime'" v-model="formData[field.key]" type="datetime" :placeholder="field.placeholder || `请选择${field.label}`" :rules="getFieldRules(field)" />

            <!-- 单选框组 -->
            <var-radio-group v-else-if="field.type === 'radio'" v-model="formData[field.key]" :rules="getFieldRules(field)">
              <var-radio v-for="option in field.options" :key="option.value" :checked-value="option.value">
                {{ option.label }}
              </var-radio>
            </var-radio-group>

            <!-- 多选框组 -->
            <var-checkbox-group v-else-if="field.type === 'checkbox-group'" v-model="formData[field.key]" :rules="getFieldRules(field)">
              <var-checkbox v-for="option in field.options" :key="option.value" :checked-value="option.value">
                {{ option.label }}
              </var-checkbox>
            </var-checkbox-group>

            <!-- 评分 -->
            <var-rate v-else-if="field.type === 'rate'" v-model="formData[field.key]" :rules="getFieldRules(field)" />

            <!-- 滑块 -->
            <var-slider v-else-if="field.type === 'slider'" v-model="formData[field.key]" :min="field.min || 0" :max="field.max || 100" :step="field.step || 1" :rules="getFieldRules(field)" />

            <!-- 文件上传 -->
            <var-uploader v-else-if="field.type === 'file'" v-model="formData[field.key]" :rules="getFieldRules(field)" :maxlength="field.maxFiles || 1" :accept="field.accept" />

            <!-- 颜色选择 -->
            <var-color-picker v-else-if="field.type === 'color'" v-model="formData[field.key]" :rules="getFieldRules(field)" />

            <!-- 自定义组件 -->
            <component v-else-if="field.type === 'custom' && field.component" :is="field.component" v-model="formData[field.key]" v-bind="field.props || {}" :rules="getFieldRules(field)" />

            <!-- 字段描述 -->
            <div v-if="field.description" class="text-xs text-gray-500 mt-1">
              {{ field.description }}
            </div>
          </var-paper>
        </div>

        <!-- 提交按钮 -->
        <div class="mt-8 space-y-3">
          <var-button type="primary" block :loading="submitting" @click="handleSubmit" class="h-12 text-lg">
            {{ formConfig.submitText || "提交" }}
          </var-button>

          <var-button v-if="formConfig.showCancelButton !== false" block @click="handleBack" class="h-12 text-lg">
            {{ formConfig.cancelText || "取消" }}
          </var-button>
        </div>
      </var-form>

      <!-- 加载状态 -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <var-loading type="wave" size="large" />
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>
    </div>

    <!-- 消息提示 -->
    <var-snackbar v-model:show="showMessage" :type="messageType" :duration="3000" position="top">
      {{ message }}
    </var-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCacheStore } from "@/stores";
import XFMAPPHeader from "@/components/XFMAPPHeader/index.vue";

const router = useRouter();
const route = useRoute();
const cacheStore = useCacheStore();

// 响应式数据
const form = ref(null);
const formData = ref({});
const submitting = ref(false);
const showMessage = ref(false);
const message = ref("");
const messageType = ref("success");

// 表单配置
const formConfig = ref({
  title: "编辑表单",
  fields: [],
  submitText: "提交",
  cancelText: "取消",
  showCancelButton: true,
  initialData: null,
  onSubmit: null,
});

// 初始化表单
const initForm = () => {
  // 直接从缓存store获取配置
  const config = cacheStore.getFormConfig();

  if (config) {
    formConfig.value = config;

    // 从配置中获取初始数据
    const initialData = config.initialData;

    // 初始化表单数据
    const initialFormData = {};
    config.fields.forEach((field) => {
      let defaultValue = "";

      // 根据字段类型设置默认值
      switch (field.type) {
        case "checkbox":
        case "switch":
          defaultValue = false;
          break;
        case "checkbox-group":
          defaultValue = [];
          break;
        case "number":
        case "rate":
        case "slider":
          defaultValue = 0;
          break;
        case "file":
          defaultValue = [];
          break;
        default:
          defaultValue = "";
      }

      initialFormData[field.key] = initialData?.[field.key] ?? field.defaultValue ?? defaultValue;
    });
    formData.value = initialFormData;
  } else {
    showNotification("表单配置不存在", "error");
    handleBack();
  }
};

// 在script setup中添加showNotification函数
const showNotification = (msg, type = "info") => {
  message.value = msg;
  messageType.value = type;
  showMessage.value = true;
};

// 获取字段验证规则 - 修改后的版本
const getFieldRules = (field) => {
  // 如果字段有validation配置，使用配置的规则
  if (field.validation) {
    const validation = field.validation;

    // 必填验证
    if (validation.required) {
      return (v) => !!v || validation.message || `请输入${field.label}`;
    }

    /*                               待优化!!                                  */
    // 长度验证
    if (validation.minLength || validation.maxLength) {
      rules.push({
        validator: (value) => {
          if (!value && !validation.required) return true;
          const length = String(value).length;
          if (validation.minLength && length < validation.minLength) {
            return `${field.label}长度不能少于${validation.minLength}个字符`;
          }
          if (validation.maxLength && length > validation.maxLength) {
            return `${field.label}长度不能超过${validation.maxLength}个字符`;
          }
          return true;
        },
      });
    }

    // 数值验证
    if (validation.min !== undefined || validation.max !== undefined) {
      rules.push({
        validator: (value) => {
          if (!value && !validation.required) return true;
          const num = Number(value);
          if (isNaN(num)) return `${field.label}必须是数字`;
          if (validation.min !== undefined && num < validation.min) {
            return `${field.label}不能小于${validation.min}`;
          }
          if (validation.max !== undefined && num > validation.max) {
            return `${field.label}不能大于${validation.max}`;
          }
          return true;
        },
      });
    }

    // 正则验证
    if (validation.pattern) {
      rules.push({
        validator: (value) => {
          if (!value && !validation.required) return true;
          if (!validation.pattern.test(value)) {
            return validation.message || `${field.label}格式不正确`;
          }
          return true;
        },
      });
    }

    // 自定义验证
    if (validation.validator) {
      rules.push({
        validator: validation.validator,
      });
    }

    // 数组长度验证（用于多选、文件上传等）
    if (validation.minItems || validation.maxItems) {
      rules.push({
        validator: (value) => {
          if (!value && !validation.required) return true;
          if (!Array.isArray(value)) return true;
          if (validation.minItems && value.length < validation.minItems) {
            return `${field.label}至少选择${validation.minItems}项`;
          }
          if (validation.maxItems && value.length > validation.maxItems) {
            return `${field.label}最多选择${validation.maxItems}项`;
          }
          return true;
        },
      });
    }
  } else {
    // 如果没有validation配置，添加默认的必填校验
    return (v) => !!v || `请输入${field.label}`;
  }
};

// 修改handleSubmit函数，增加调试信息
const handleSubmit = async () => {
  try {
    console.log("开始表单校验...");
    console.log("表单数据:", formData.value);
    console.log("表单配置:", formConfig.value);

    // 检查表单引用是否存在
    if (!form.value) {
      console.error("表单引用不存在");
      showNotification("表单初始化失败", "error");
      return;
    }

    const valid = await form.value.validate();
    console.log("校验结果:", valid);

    if (!valid) {
      showNotification("请检查表单填写是否正确", "error");
      return;
    }

    submitting.value = true;

    // 调用配置中的提交函数
    if (formConfig.value.onSubmit) {
      const success = await formConfig.value.onSubmit(formData.value);
      if (success) {
        showNotification("提交成功", "success");
        setTimeout(() => {
          handleBack();
        }, 1000);
      } else {
        showNotification("提交失败，请重试", "error");
      }
    } else {
      showNotification("提交成功", "success");
      setTimeout(() => {
        handleBack();
      }, 1000);
    }
  } catch (error) {
    console.error("表单提交失败:", error);
    showNotification("提交失败，请重试", "error");
  } finally {
    submitting.value = false;
  }
};

// 返回上一页
const handleBack = () => {
  router.back();
};

// 生命周期
onMounted(() => {
  initForm();
});
</script>

<style scoped>
/* 自定义样式 */
.form-field {
  transition: all 0.3s ease;
}

.form-field:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
