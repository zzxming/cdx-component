import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import * as glob from 'glob';
import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import type { OutputOptions, ModuleFormat } from 'rollup';

import { PKG_NAME, PKG_PREFIX, buildOutput, cdxRoot, pkgRoot, componentPackage } from './constans';
import { rollupExternalFromPackage } from './utils';

const beforeWriteFile = (target: string) => {
    return (filePath: string, content: string) => {
        if (['gulpfile', 'build'].some((exclude) => filePath.includes(exclude))) return false;
        // rollup 打包根为 cdx-component, 打包后文件需同步 d.ts 出现在根, 并处理相对路径
        if (filePath.includes(`/${target}/cdx-component/`)) {
            return {
                filePath: filePath.replace(`/${target}/cdx-component/`, `/${target}/`),
                content: content.replace(/\.\.\//g, './'),
            };
        }
    };
};
const dtsConfig = (target: string) => {
    return {
        entryRoot: pkgRoot,
        outDir: resolve(buildOutput, target),
        tsconfigPath: '../tsconfig.json',
        beforeWriteFile: beforeWriteFile(target),
    };
};
const rollupOutput = (target: ModuleFormat, format: string): OutputOptions => ({
    format: target,
    entryFileNames: '[name].js',
    preserveModules: true,
    dir: resolve(buildOutput, format),
    preserveModulesRoot: cdxRoot,
    paths: (id: string) => {
        if (id.startsWith(`${PKG_PREFIX}/theme`)) {
            return id.replace(PKG_PREFIX, PKG_NAME);
        }
        return id;
    },
});

const input = glob
    .sync('**/*.{js,ts,vue}', {
        cwd: pkgRoot,
        ignore: ['**/*.config.*'],
        absolute: true,
    })
    .filter((path) => !['node_modules', 'gulpfile', 'dist'].some((exclude) => path.includes(exclude)));

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        commonjs(),
        esbuild({
            target: 'chrome64',
            loaders: {
                '.vue': 'js',
            },
        }),
        dts(dtsConfig('es')),
        dts(dtsConfig('lib')),
    ],
    build: {
        target: 'modules',
        outDir: resolve(buildOutput, 'es'),
        sourcemap: true,
        minify: false,
        rollupOptions: {
            input,
            external: rollupExternalFromPackage(componentPackage, (id: string) => {
                return /css$/.test(id);
            }),
            treeshake: false,
            preserveEntrySignatures: 'allow-extension',
            output: [rollupOutput('es', 'es'), rollupOutput('cjs', 'lib')],
        },
    },
});
