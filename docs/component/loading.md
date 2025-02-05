# Drawer

## 基础用法

:::demo loading/base.vue

:::

## 指令调用

:::demo loading/directive.vue

:::

## 函数调用

:::demo loading/service.vue

:::

当你使用函数方式调用的全屏 Loading 是单例的。 若在前一个全屏 Loading 关闭前再次调用全屏 Loading，并不会创建一个新的 Loading 实例，而是返回现有全屏 Loading 的实例：

```ts
const loadingInstance1 = CdxLoading.service({ fullscreen: true });
const loadingInstance2 = CdxLoading.service({ fullscreen: true });
console.log(loadingInstance1 === loadingInstance2); // true
```

## Loading Props

| 名称       | 类型      | 说明                 | 默认值  |
| ---------- | --------- | -------------------- | ------- |
| visible    | `boolean` | 是否显示加载         | `false` |
| fullscreen | `boolean` | 是否全屏显示         | `false` |
| text       | `string`  | 在加载图标下面的文字 | -       |
| background | `string`  | 遮罩背景色           | -       |
| lock       | `boolean` | 锁定滚动条           | `true`  |

## v-loading

| 名称               | 类型     | 说明                       | 默认值 |
| ------------------ | -------- | -------------------------- | ------ |
| loading-text       | `string` | 同组件的 `text` 属性       | -      |
| loading-background | `string` | 同组件的 `background` 属性 | -      |

## CdxLoading.service

| 参数       | 类型                    | 说明                                                                                                                            | 默认值  |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------- |
| text       | `string`                | 同组件的 `text` 属性                                                                                                            | -       |
| background | `string`                | 同组件的 `background` 属性                                                                                                      | -       |
| fullscreen | `boolean`               | 同组件的 `fullscreen` 属性                                                                                                      | `false` |
| target     | `string \| HTMLElement` | 插入至的 DOM 节点。可传入一个 DOM 对象或字符串； 若传入字符串，则会将其作为参数传入 document.querySelector以获取到对应 DOM 节点 | -       |

| 返回值   | 类型         | 说明             |
| -------- | ------------ | ---------------- |
| close    | `() => void` | 用于关闭 Loading |
| instance | `object`     | 生成的 vue 实例  |
| vm       | `object`     | 挂载组件实例     |
