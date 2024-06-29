import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import {
  buildOutput,
  buildRoot,
  cdxPackage,
  cdxRoot,
  pkgRoot,
  rollupExternalFromPackage,
} from '@cdx-component/build-utils';
import dts from 'vite-plugin-dts';

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
    dts({
      entryRoot: pkgRoot,
      outDir: buildOutput,
      tsconfigPath: resolve(buildRoot, 'tsconfig.json'),
      rollupTypes: true,
    }),
  ],
  build: {
    sourcemap: true,
    minify: false,
    rollupOptions: {
      input: resolve(cdxRoot, 'index.ts'),
      external: rollupExternalFromPackage(cdxPackage, (id: string) => id.endsWith('css'), { full: true }),
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
