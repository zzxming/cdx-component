# Capthca

## 基础用法

:::demo captcha/slider.vue

:::

## 点击验证

可使用 `onBeforeSuccess` 监听验证验证并控制是否验证成功

:::demo captcha/point.vue

:::

## 图形拼接

:::demo captcha/draw.vue

:::

## Captcha Props

| 名称            | 类型                                                                      | 说明                              | 默认值       |
| --------------- | ------------------------------------------------------------------------- | --------------------------------- | ------------ |
| type            | `'slider' \| 'pointer'`                                                   | 验证的方式                        | `'slider'`   |
| canvasSize      | `[number, number]`                                                        | 画布大小                          | `[500, 300]` |
| image           | `string`                                                                  | 图片地址                          | -            |
| texts           | `string[]`                                                                | 验证方式为 `pointer` 时的验证文字 | -            |
| fontRate        | `number`                                                                  | 字体大小比例，取值范围在 0-1 之间 | `0.108`      |
| loading         | `boolean`                                                                 | 是否加载中                        | `false`      |
| tipDuration     | `number`                                                                  | 提示框显示时间                    | `3000`       |
| onRefresh       | `() => void        \| Promise<void>`                                      | 刷新时触发的回调                  | `true`       |
| onBeforeSuccess | `() => boolean \| CheckStatusInfo \| Promise<CheckStatusInfo \| boolean>` | 验证成功时触发的回调              | `true`       |

## Captcha Events

| 名称     | 说明                 | 参数 |
| -------- | -------------------- | ---- |
| success  | 当验证成功时触发     | -    |
| fail     | 当验证失败时触发     | -    |
| imgError | 当图片加载失败时触发 | -    |

## Captcha Slots

| 名称    | 说明           | 参数 |
| ------- | -------------- | ---- |
| refresh | 刷新按钮的插槽 | -    |

## CaptchaSlider Props

| 名称            | 类型                                | 说明                       | 默认值  |
| --------------- | ----------------------------------- | -------------------------- | ------- |
| target          | `number`                            | 验证的移动值，范围在 0-100 | `100`   |
| loading         | `boolean`                           | 是否加载中                 | `false` |
| lock            | `boolean`                           | 是否锁定拖动               | `false` |
| tolerance       | `number`                            | 判断误差范围，范围在 0-100 | `1`     |
| onBeforeSuccess | `() => boolean \| Promise<boolean>` | 验证成功时触发的回调       | -       |

## CaptchaSlider Events

| 名称    | 说明             | 参数              |
| ------- | ---------------- | ----------------- |
| success | 当验证成功时触发 | -                 |
| fail    | 当验证失败时触发 | -                 |
| move    | 当滑块移动时触发 | `(value: number)` |

## CaptchaSlider Exposes

| 名称      | 说明               | 类型                      |
| --------- | ------------------ | ------------------------- |
| trackRef  | 滑块 `ref`         | `HTMLDivElement`          |
| resetting | 是否处于重置状态中 | `boolean`                 |
| currentX  | 当前移动百分比     | `number`                  |
| reset     | 重置验证           | `(value: number) => void` |

## CaptchaSlider Slots

| 名称    | 说明         | 参数                   |
| ------- | ------------ | ---------------------- |
| tip     | 滑块槽内文字 | `(isSuccess: boolean)` |
| trigger | 滑块内文字   | -                      |

## 内置类型

```ts
interface CheckStatusInfo {
  success: boolean;
  message: string;
}

enum CheckStatus {
  success = 'success',
  fail = 'fail',
  none = 'none',
}
```
