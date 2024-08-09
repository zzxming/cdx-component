# TextHighlight

## 基础用法

:::demo text-highlight/base

:::

## 插槽显示文字

:::demo text-highlight/slot

:::

## TextHighlight Props

| 名称           | 类型                 | 说明               | 默认值  |
| -------------- | -------------------- | ------------------ | ------- |
| content        | `string`             | 显示文字           | -       |
| texts          | `string \| string[]` | 高亮的文字         | `''`    |
| ignoreCase     | `boolean`            | 匹配时忽略大小写   | `false` |
| highlightTag   | `string`             | 高亮文字的标签名   | `span`  |
| highlightClass | `boolean`            | 高亮文字标签的类名 | `''`    |

## TextHighlight Slots

| 名称      | 说明       | 参数             |
| --------- | ---------- | ---------------- |
| default   | 非高亮文字 | `(text: string)` |
| highlight | 高亮文字   | `(text: string)` |
