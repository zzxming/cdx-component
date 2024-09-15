# Button

## 基础用法

:::demo button/base

:::

## 按钮尺寸

:::demo button/size

:::

## 加载中图标

:::demo button/loading

:::

## Button Props

| 名称     | 类型                                                              | 说明                 | 默认值  |
| -------- | ----------------------------------------------------------------- | -------------------- | ------- |
| size     | `'small' \| 'default' \| 'large' \| ''`                           | 尺寸                 | `''`    |
| type     | `'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| ''` | 类型                 | `''`    |
| plain    | `Boolean`                                                         | 是否为朴素按钮       | `false` |
| round    | `Boolean`                                                         | 是否为圆角按钮       | `false` |
| loading  | `Boolean`                                                         | 是否为加载中状态     | `false` |
| disabled | `Boolean`                                                         | 是否为加载中禁用状态 | `false` |

## Button Slots

| 名称    | 说明               | 参数                 |
| ------- | ------------------ | -------------------- |
| default | 按钮内容插槽       | -                    |
| prefix  | 按钮内容的前缀插槽 | -                    |
| suffix  | 按钮内容的后缀插槽 | -                    |
| loading | 按钮加载中图标插槽 | `(loading: boolean)` |
