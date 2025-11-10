/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html', // 如果你有 public/index.html
    './src/**/*.{js,ts,jsx,tsx}', // 扫描所有源码文件
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // 自定义主色（例如 Tailwind 的 indigo-500）
        accent: '#22d3ee',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
