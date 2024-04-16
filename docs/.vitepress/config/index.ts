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
                        { text: 'captcha', link: '/component/captcha' },
                        { text: 'drawer', link: '/component/drawer' },
                    ],
                },
            ],
        },
    },
};
