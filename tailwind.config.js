/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}", "./src/index.html"],
  theme: {
    extend: {
      // 移动端安全区域
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      // 移动端友好的字体大小
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      // 触摸友好的最小尺寸
      minHeight: {
        touch: "44px", // iOS 推荐的最小触摸目标
      },
      minWidth: {
        touch: "44px",
      },
      // 移动端断点
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
  // 兼容 Varlet UI
  corePlugins: {
    preflight: false,
  },
};
