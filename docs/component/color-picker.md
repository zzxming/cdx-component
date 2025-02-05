# ColorPicker

## 基础用法

目前仅支持 `hex` 格式作为`modelValue`绑定值。

:::demo color-picker/base.vue

:::

## 仅选择框

:::demo color-picker/selector.vue

:::

## ColorPicker Props

| 名称       | 类型      | 说明                 | 默认值   |
| ---------- | --------- | -------------------- | -------- |
| modelValue | `string`  | hex颜色值            | `ff0000` |
| selectOnly | `boolean` | 是否仅显示颜色选择框 | `false`  |
