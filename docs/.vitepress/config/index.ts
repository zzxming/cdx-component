
import { defineConfig } from 'vitepress';
import { mdPlugin } from './plugins';

export default defineConfig({
    title: 'Cdx Component',
    description: 'A Vue 3 UI library.',
    markdown: {
        config: mdPlugin,
    },
    appearance: false,
    themeConfig: {
        sidebar: {
            '/component/': [
                {
                    text: 'Component',
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
