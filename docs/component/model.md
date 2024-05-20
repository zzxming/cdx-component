<script>
if (!import.meta.env.SSR) {
    document.body.classList.add('vp-raw')
}
</script>

# Model

## 基础用法

:::demo model/base

:::

## 函数调用

:::demo model/service

:::

## Model Props

| 名称                 | 类型      | 说明                   | 默认值  |
| -------------------- | --------- | ---------------------- | ------- |
| modelValue / v-model | `boolean` | 是否打开               | `false` |
| width                | `string`  | 弹窗宽度, 注意携带单位 | `'50%'` |
| maskClose            | `boolean` | 是否可点击蒙层关闭     | `true`  |
| fullscreen           | `boolean` | 全屏显示               | `false` |
| destroyOnClose       | `boolean` | 关闭后销毁             | `true`  |

## Model 事件

| 名称  | 说明       | 类型         |
| ----- | ---------- | ------------ |
| close | 关闭时触发 | `() => void` |

## Model 插槽

| 名称    | 说明         | 类型 |
| ------- | ------------ | ---- |
| default | 主体显示内容 | -    |
| header  | 顶部显示内容 | -    |
| footer  | 底部显示内容 | -    |

## CdxModel.service 函数

| 参数           | 类型                    | 说明                                                                                                                            | 默认值  |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------- |
| body           | `VNode \| string`       | default 插槽渲染内容                                                                                                            | -       |
| header         | `VNode \| string`       | header 插槽渲染内容                                                                                                             | -       |
| footer         | `string \| HTMLElement` | 插入至的 DOM 节点。可传入一个 DOM 对象或字符串； 若传入字符串，则会将其作为参数传入 document.querySelector以获取到对应 DOM 节点 | -       |
| width          | `string`                | 弹窗宽度, 注意携带单位                                                                                                          | `'50%'` |
| maskClose      | `boolean`               | 是否可点击蒙层关闭                                                                                                              | `true`  |
| fullscreen     | `boolean`               | 全屏显示                                                                                                                        | `false` |
| destroyOnClose | `boolean`               | 关闭后销毁                                                                                                                      | `true`  |

| 返回值 | 类型         | 说明           |
| ------ | ------------ | -------------- |
| close  | `() => void` | 用于关闭 Model |
