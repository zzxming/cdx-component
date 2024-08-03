<script>
if (!import.meta.env.SSR) {
    document.body.classList.add('vp-raw')
}
</script>

# ToolTip

## 基础用法

:::demo tooltip/base

:::

## 插槽替换

:::demo tooltip/slot

:::

## 指令调用

:::demo tooltip/directive

:::

## ToolTip Props

| 名称      | 类型                                     | 说明             | 默认值  |
| --------- | ---------------------------------------- | ---------------- | ------- |
| direction | `'top' \| 'right' \| 'bottom' \| 'left'` | 提示位置         | `'top'` |
| text      | `string`                                 | 提示文字         | `''`    |
| hideDelay | `number`                                 | 隐藏延迟时间(ms) | `200`   |

## ToolTip 插槽

| 名称    | 说明         | 参数 |
| ------- | ------------ | ---- |
| default | 主体显示内容 | -    |
