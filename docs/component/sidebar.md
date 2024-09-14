# Sidebar

## 基础用法

:::demo sidebar/base

:::

## 展开按钮

:::demo sidebar/collapse

:::

## Sidebar Props

| 名称                 | 类型                                     | 说明                                                                           | 默认值   |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------------------ | -------- |
| modelValue / v-model | `boolean`                                | 是否打开                                                                       | `false`  |
| direction            | `'left' \| 'right' \| 'top' \| 'bottom'` | 展开方向                                                                       | `'left'` |
| fullscreen           | `boolean`                                | 是否全屏打开                                                                   | `false`  |
| size                 | `string \| number`                       | sidebar 大小，direction 为 'left' 或 'right' 时为宽度，否则为高度，单位默认 px | '300px'  |
| mask                 | `boolean`                                | 是否显示遮罩                                                                   | `false`  |

## Sidebar Slots

| 名称     | 说明         | 参数 |
| -------- | ------------ | ---- |
| default  | 显示内容     | -    |
| collapse | 展开按钮内容 | -    |
