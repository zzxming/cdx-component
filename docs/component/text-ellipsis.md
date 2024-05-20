# TextEllipsis

## 基础用法

:::demo text-ellipsis/base

:::

## TextEllipsis Props

| 名称                 | 类型      | 说明                 | 默认值  |
| -------------------- | --------- | -------------------- | ------- |
| modelValue / v-model | `boolean` | 是否打开             | `false` |
| content              | `string`  | 显示文字             | -       |
| lines                | `number`  | 省略时显示文字行数   | `1`     |
| ellipsisText         | `string`  | 省略号的文本内容     | `...`   |
| canExpand            | `boolean` | 是否显示点击展开按钮 | `true`  |
| expandText           | `boolean` | 展开按钮显示文字     | `展开`  |
| collapseText         | `boolean` | 收起按钮显示文字     | `收起`  |

## TextEllipsis 插槽

| 名称      | 说明         | 参数                                  |
| --------- | ------------ | ------------------------------------- |
| default   | 显示文字内容 | `(isExpanded: boolean, text: string)` |
| expandBtn | 展开按钮内容 | `(isExpanded: boolean)`               |
