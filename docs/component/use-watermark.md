# useWatermark

生成水印

## 基础用法

`content` 为文本水印内容, 多行文本使用数组

:::demo use-watermark/base.vue

:::

## 图片水印

若图片加载失败, 会退级使用 `content`

:::demo use-watermark/image.vue

:::

## Options

| 名称    | 类型                 | 说明                    | 默认值               |
| ------- | -------------------- | ----------------------- | -------------------- |
| content | `string \| string[]` | 水印文字内容            | -                    |
| image   | `string`             | 水印图片                | -                    |
| width   | `number`             | 水印宽度                | 120                  |
| height  | `number`             | 水印高度                | 64                   |
| rotate  | `number`             | 旋转角度                | -22                  |
| zIndex  | `number`             | 水印设置元素 z-index 值 | 10                   |
| gap     | `[number, number]`   | 水印间距                | [100,100]            |
| offset  | `[number, number]`   | 水印距离左上角偏移值    | [gap[0]/2, gap[1]/2] |
| font    | `Font`               | 水印文本样式            | -                    |

### Font

| 名称       | 类型                                                                          | 说明     | 默认值             |
| ---------- | ----------------------------------------------------------------------------- | -------- | ------------------ |
| color      | `string \| string[]`                                                          | 颜色     | rgba(0, 0, 0, .15) |
| fontSize   | `number`                                                                      | 字体大小 | 16                 |
| fontWeight | `string`                                                                      | 字重     | normal             |
| fontFamily | `string`                                                                      | 字体     | sans-serif         |
| fontGap    | `number`                                                                      | 字体间隙 | 3                  |
| textAlign  | `'start' \| 'end' \| 'left' \| 'right' \| 'center'`                           | 文本对齐 | 'center'           |
| textAlign  | `'top' \| 'hanging' \| 'middle' \| 'alphabetic' \| 'ideographic' \| 'bottom'` | 文本基线 | 'alphabetic'       |
