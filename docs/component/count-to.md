# CountTo

## 基础用法

:::demo count-to/base

:::

## 手动控制开始与暂停

:::demo count-to/control

:::

## 设置计数保留小数点位数

:::demo count-to/decimal

:::

## CountTo Props

| 名称       | 类型      | 说明                                                                   | 默认值 |
| ---------- | --------- | ---------------------------------------------------------------------- | ------ |
| startValue | `number`  | 计数起始值                                                             | 0      |
| endValue   | `number`  | 计数结束目标值                                                         | -      |
| duration   | `number`  | 从起始值到目标值所经过的时间                                           | 2000   |
| decimal    | `number`  | 保留小数点位数，默认会保留 `startValue` 和 `endValue` 中最长的小数位数 | -      |
| autoStart  | `boolean` | 自动开始计数                                                           | true   |

## CountTo 插槽

| 名称    | 说明     | 参数                   |
| ------- | -------- | ---------------------- |
| default | 显示内容 | (currentValue: number) |
