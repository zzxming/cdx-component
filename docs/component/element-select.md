# ElementSelect

## 基础用法

可以长按拖动鼠标一次选中多选或取消选中

:::demo element-select/base.vue

:::

## 单个元素选中

:::demo element-select/item.vue

:::

## ElementSelect Props

| 名称                 | 类型                       | 说明                    | 默认值  |
| -------------------- | -------------------------- | ----------------------- | ------- |
| modelValue / v-model | `ElementSelectValueType[]` | 当前选中子项 `value` 值 | -       |
| tag                  | `string`                   | 生成元素的标签名        | `div`   |
| max                  | `number`                   | 最多可选中的个数        | -       |
| disabled             | `boolean`                  | 禁用选择所有子项        | `false` |

## ElementSelectItem Props

| 名称                 | 类型                     | 说明                    | 默认值  |
| -------------------- | ------------------------ | ----------------------- | ------- |
| modelValue / v-model | `ElementSelectValueType` | 当前选中子项 `value` 值 | -       |
| trueValue            | `ElementSelectValueType` | 选中时的值              | `div`   |
| falseValue           | `ElementSelectValueType` | 未选中时的值            | -       |
| disabled             | `boolean`                | 禁用当前项              | `false` |
