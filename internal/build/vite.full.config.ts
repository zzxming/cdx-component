import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import { buildOutput, cdxPackage, rollupExternalFromPackage, cdxRoot } from '@cdx-component/build-utils';

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
    ],
    build: {
        sourcemap: true,
        minify: false,
        rollupOptions: {
            input: resolve(cdxRoot, 'index.ts'),
            external: rollupExternalFromPackage(
                cdxPackage,
                (id: string) => {
                    return /css$/.test(id);
                },
                { full: true },
            ),
            treeshake: false,
            preserveEntrySignatures: 'allow-extension',
            output: [
                {
                    dir: buildOutput,
                    entryFileNames: 'index.js',
                    format: 'umd',
                    name: 'CdxComponent',
                    exports: 'named',
                },
                {
                    dir: buildOutput,
                    entryFileNames: 'index.esm.js',
                    format: 'esm',
                },
            ],
        },
    },
});
