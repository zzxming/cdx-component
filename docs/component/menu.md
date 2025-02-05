# Menu

## 基础用法

:::demo menu/base.vue

:::

## 右键菜单

:::demo menu/contextmenu.vue

:::

## Menu Props

| 名称        | 类型               | 说明                         | 默认值  |
| ----------- | ------------------ | ---------------------------- | ------- |
| visible     | `boolean`          | 是否可见                     | `true`  |
| width       | `string \| number` | 列表宽度, 字符串需要自带单位 | `'50%'` |
| contextmenu | `boolean`          | 是否为 fixed 模式            | `false` |
| x           | `number`           | fixed 模式下的 left 值       | `0`     |
| y           | `number`           | fixed 模式下的 top 值        | `0`     |

## MenuItem Props

| 名称 | 类型                             | 说明     | 默认值   |
| ---- | -------------------------------- | -------- | -------- |
| type | `'break' \| 'item' \| undefined` | 表现形式 | `'item'` |

## MenuItem Slots

| 名称     | 说明                                                         | 参数 |
| -------- | ------------------------------------------------------------ | ---- |
| default  | 列表项的显示内容                                             | -    |
| children | 子菜单内容, 将会自动包裹 CdxMenu, 且设置 contextmenu 为 true | -    |
