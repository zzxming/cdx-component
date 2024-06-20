import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { demoImports } from './.vitepress/config/plugins';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';

const projRoot = path.resolve(__dirname, '..');

export default defineConfig({
    resolve: {
        alias: [
            { find: /^@docs\/(.+)/, replacement: path.resolve(__dirname, '$1') },
            {
                find: /^cdx-component(\/(es|lib))?$/,
                replacement: path.resolve(projRoot, 'packages/cdx-component/index.ts'),
            },
            {
                find: /^cdx-component\/(theme)\/(.*)$/,
                replacement: `${path.resolve(projRoot, 'packages')}/$1/$2`,
            },
        ],
    },
    server: {
        port: 9000,
        host: '0.0.0.0',
    },
    plugins: [
        Components({
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
            allowOverrides: true,
            dirs: ['.vitepress/components'],
            resolvers: [IconsResolver()],
        }),
        Icons({
            autoInstall: true,
            compiler: 'vue3',
        }),
        inspect(),
        demoImports(),
    ],
});
