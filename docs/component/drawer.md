# Drawer

## 基础用法

:::demo drawer/base

:::

## 全屏

全屏时需要手动控制 modelValue 打开

:::demo drawer/fullscreen

:::

## 拖拽禁用

:::demo drawer/disable-slide

:::

## Drawer Props

| 名称                 | 类型                                     | 说明                                                                           | 默认值   |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------------------ | -------- |
| modelValue / v-model | `boolean`                                | 是否打开                                                                       | `false`  |
| direction            | `'left' \| 'right' \| 'top' \| 'bottom'` | 打开与滑动拖拽的方向                                                           | `'left'` |
| fullscreen           | `boolean`                                | 是否全屏打开                                                                   | `false`  |
| slide                | `boolean`                                | 是否可以滑动打开                                                               | `true`   |
| clickMaskClose       | `boolean`                                | 是否可以点击蒙层关闭                                                           | `true`   |
| size                 | `number \| string`                       | 打开宽度，当 `direction` 为 `top` 或 `bottom` 时为高度，传入字符串需要携带单位 | `68%`    |
| bodySlide            | `boolean`                                | 可否在打开内容出滑动拖拽                                                       | `true`   |
| breakBoundary        | `number`                                 | 内容后多显示的距离，单位为 px                                                  | `16`     |

## Drawer Slots

| 名称    | 说明                      | 参数 |
| ------- | ------------------------- | ---- |
| default | Drawer 的显示内容         | -    |
| swipe   | Drawer 的滑动拖拽范围区域 | -    |
