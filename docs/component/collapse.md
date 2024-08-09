# Collapse

## 基础使用

::: demo collapse/base

:::

## 每次只能展开一个面板

::: demo collapse/solo

:::

## 单独使用

单独使用时可以通过控制 expend 展开，如果在 Collapse 组件内则会忽略 expend 属性

::: demo collapse/item

:::

## 过渡组件

:::demo collapse/transition

:::

## Collapse Props

| 名称                 | 类型               | 说明                   | 默认值  |
| -------------------- | ------------------ | ---------------------- | ------- |
| modelValue / v-model | `string \| number` | 当前展开项             | `[]`    |
| is-solo              | `boolean`          | 是否为最多展开一个面板 | `false` |

## Collapse Events

| 名称   | 说明                 | 参数                   |
| ------ | -------------------- | ---------------------- |
| change | 切换当前展开项时触发 | `(string \| number)[]` |

## CollapseItem Props

| 名称                    | 类型               | 说明             | 默认值 |
| ----------------------- | ------------------ | ---------------- | ------ |
| expend / v-model:expend | `boolean`          | 当前是否展开     | `true` |
| name                    | `string \| number` | 当前展开项标识符 | -      |
| title                   | `string`           | 标题             | `''`   |

## CollapseItem Slots

| 名称    | 说明         | 参数              |
| ------- | ------------ | ----------------- |
| default | 主体显示内容 | -                 |
| title   | 展开按钮     | `(title: string)` |
