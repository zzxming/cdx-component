# CountTo

## 基础用法

:::demo count-to/base.vue

:::

## 手动控制开始与暂停

:::demo count-to/control.vue

:::

## 设置计数保留小数点位数

:::demo count-to/decimal.vue

:::

当在使用 `animation` 动画时，整体的计数动画时长会改变，整体时长会由 `duration` 变为 `duration` + `animationDuration`，在使用 `stopCount` 时也会延迟 `animationDuration` 的时间才完全停止，所以如果将 `animationDuration` 设置为 0 ，则不会出现滚动动画

## CountTo Props

| 名称              | 类型      | 说明                                                                   | 默认值  |
| ----------------- | --------- | ---------------------------------------------------------------------- | ------- |
| startValue        | `number`  | 计数起始值                                                             | `0`     |
| endValue          | `number`  | 计数结束目标值                                                         | -       |
| duration          | `number`  | 从起始值到结束目标值的计数时长，单位ms                                 | `2000`  |
| decimal           | `number`  | 保留小数点位数，默认会保留 `startValue` 和 `endValue` 中最长的小数位数 | -       |
| autoStart         | `boolean` | 自动开始计数                                                           | `true`  |
| animation         | `boolean` | 是否使用滚动动画                                                       | `false` |
| animationDuration | `number`  | 滚动动画的持续时长，单位ms                                             | `2000`  |

## CaptchaSlider Events

| 名称   | 说明               | 参数              |
| ------ | ------------------ | ----------------- |
| change | 当前数字变化时触发 | `(value: number)` |
| finish | 计数完成后触发     | -                 |

## CaptchaSlider Exposes

| 名称       | 说明           | 类型         |
| ---------- | -------------- | ------------ |
| reset      | 重置为初始状态 | `() => void` |
| startCount | 开始计数       | `() => void` |
| stopCount  | 暂停计数       | `() => void` |

## CountTo slots

| 名称    | 说明     | 参数              |
| ------- | -------- | ----------------- |
| default | 显示内容 | `(value: number)` |
| prefix  | 数字前缀 | -                 |
| suffix  | 数字后缀 | -                 |
