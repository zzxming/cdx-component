<script>
if (!import.meta.env.SSR) {
  document.body.classList.add('vp-raw')
}
</script>

# vResize

## 基础用法

:::demo v-resize/base

:::

## v-resize 参数

| 参数      | 说明       | 类型                                     |
| --------- | ---------- | ---------------------------------------- |
| modifiers | 可拖拽的边 | `'top' \| 'right' \| 'bottom' \| 'left'` |
