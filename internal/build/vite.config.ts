import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import * as glob from 'glob';
import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import {
    pkgRoot,
    buildOutput,
    cdxPackage,
    rollupExternalFromPackage,
    dtsConfig,
    cdxRoot,
    PKG_PREFIX,
    PKG_NAME,
} from '@cdx-component/build-utils';
import type { ModuleFormat, OutputOptions } from 'rollup';

const rollupOutput = (target: ModuleFormat, format: string): OutputOptions => ({
    format: target,
    entryFileNames: '[name].js',
    preserveModules: true,
    dir: resolve(buildOutput, format),
    preserveModulesRoot: cdxRoot,
    exports: 'named',
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
        commonjs() as Plugin,
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
        sourcemap: true,
        minify: false,
        rollupOptions: {
            input,
            external: rollupExternalFromPackage(
                cdxPackage,
                (id: string) => {
                    return /css$/.test(id);
                },
                { full: false },
            ),
            treeshake: false,
            preserveEntrySignatures: 'allow-extension',
            output: [rollupOutput('es', 'es'), rollupOutput('cjs', 'lib')],
        },
    },
});
