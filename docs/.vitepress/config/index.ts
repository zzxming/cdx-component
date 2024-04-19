import { mdPlugin } from './plugins';

export default {
    title: 'Cdx Component',
    description: 'A Vue 3 UI library.',
    markdown: {
        config: mdPlugin,
    },
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
};
