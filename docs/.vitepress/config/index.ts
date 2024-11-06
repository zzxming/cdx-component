import { defineConfig } from 'vitepress';
import { mdPlugin } from './plugins';

export default defineConfig({
  title: 'Cdx Component',
  description: 'A Vue 3 UI library.',
  base: '/cdx-component/',
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0, viewport-fit=cover',
      },
    ],
  ],
  markdown: {
    config: mdPlugin,
  },
  rewrites: {
    '/index.md': '/component/usage.md',
  },
  themeConfig: {
    sidebar: {
      '/component/': [
        {
          text: '介绍',
          items: [{ text: 'Usage', link: '/component/usage' }],
        },
        {
          text: '组件',
          items: [
            { text: 'Captcha', link: '/component/captcha' },
            { text: 'Drawer', link: '/component/drawer' },
            { text: 'CountTo', link: '/component/count-to' },
            { text: 'ElementSelect', link: '/component/element-select' },
            { text: 'Loading', link: '/component/loading' },
            { text: 'Collapse', link: '/component/collapse' },
            { text: 'Model', link: '/component/model' },
            { text: 'Overlay', link: '/component/overlay' },
            { text: 'TextEllipsis', link: '/component/text-ellipsis' },
            { text: 'TextHighlight', link: '/component/text-highlight' },
            { text: 'PullRefresh', link: '/component/pull-refresh' },
            { text: 'Tooltip', link: '/component/tooltip' },
            { text: 'Resize', link: '/component/resize' },
            { text: 'Sidebar', link: '/component/sidebar' },
            { text: 'Button', link: '/component/button' },
            { text: 'Scrollbar', link: '/component/scrollbar' },
          ],
        },
        {
          text: '指令',
          items: [
            { text: 'SameClickTarget', link: '/component/same-click-target' },
            { text: 'Ripple', link: '/component/ripple' },
            { text: 'InfinityScroll', link: '/component/infinity-scroll' },
          ],
        },
        {
          text: '钩子',
          items: [
            { text: 'useDynamicFormItem', link: '/component/use-dynamic-form-item' },
            { text: 'useForwardRef', link: '/component/use-forward-ref' },
          ],
        },
      ],
    },
  },
});
