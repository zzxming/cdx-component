# PullRefresh

## 基础用法

:::demo pull-refresh/base.vue

:::

## PullRefresh Props

| 名称                 | 类型      | 说明                       | 默认值               |
| -------------------- | --------- | -------------------------- | -------------------- |
| modelValue / v-model | `boolean` | 是否处于加载中状态         | `false`              |
| disabled             | `boolean` | 是否禁用下拉刷新           | `false`              |
| headHeight           | `number`  | 顶部内容高度, px 单位      | `50`                 |
| refreshDistance      | `number`  | 触发下拉刷新的距离         | 与 `headHeight` 一致 |
| bodyLock             | `boolean` | 在下拉时是否锁定 body 滚动 | `true`               |

## PullRefresh Events

| 名称    | 说明           | 参数 |
| ------- | -------------- | ---- |
| refresh | 下拉刷新时触发 | -    |

## TextEllipsis Slots

| 名称    | 说明           | 参数                          |
| ------- | -------------- | ----------------------------- |
| default | 下拉主体内容   | -                             |
| head    | 下拉时顶部内容 | `(status: PullRefreshStatus)` |

## 内置类型

```ts
enum PullRefreshStatus {
  pulling = 'pulling',
  loading = 'loading',
  loosing = 'loosing',
  none = 'none',
}
```
