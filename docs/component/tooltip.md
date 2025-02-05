# ToolTip

## 基础用法

:::demo tooltip/base.vue

:::

## 插槽替换

:::demo tooltip/slot.vue

:::

## 指令调用

:::demo tooltip/directive.vue

:::

## ToolTip Props

| 名称      | 类型                                     | 说明             | 默认值  |
| --------- | ---------------------------------------- | ---------------- | ------- |
| direction | `'top' \| 'right' \| 'bottom' \| 'left'` | 提示位置         | `'top'` |
| text      | `string`                                 | 提示文字         | `''`    |
| hideDelay | `number`                                 | 隐藏延迟时间(ms) | `200`   |

## ToolTip Slots

| 名称    | 说明         | 参数 |
| ------- | ------------ | ---- |
| default | 主体显示内容 | -    |
| content | 提示内容     | -    |

## v-tooltip

| 参数  | 说明               | 类型                                     |
| ----- | ------------------ | ---------------------------------------- |
| value | 提示文字内容       | `string`                                 |
| arg   | 提示文字的显示方向 | `'top' \| 'right' \| 'bottom' \| 'left'` |
