export const generateRandomColor = () => {
  // 生成三个随机数作为 RGB 值
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  // 组装成颜色字符串
  const color = `rgb(${r}, ${g}, ${b})`;
  return color;
};
