import { defineConfig } from 'vitepress';
import { mdPlugin } from './plugins';

export default defineConfig({
    title: 'Cdx Component',
    description: 'A Vue 3 UI library.',
    base: '/cdx-component/',
    markdown: {
        config: mdPlugin,
    },
    rewrites: {
        '/index.md': '/component/usage.md',
    },
    appearance: false,
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
                    ],
                },
            ],
        },
    },
});
