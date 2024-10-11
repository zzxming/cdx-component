import type { ModuleFormat, OutputOptions } from 'rollup';
import { resolve } from 'node:path';
import {
  buildOutput,
  cdxPackage,
  cdxRoot,
  dtsConfig,
  excludeFiles,
  PKG_NAME,
  PKG_PREFIX,
  pkgRoot,
  rollupExternalFromPackage,
} from '@cdx-component/build-utils';
import commonjs from '@rollup/plugin-commonjs';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import * as glob from 'glob';
import esbuild from 'rollup-plugin-esbuild';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const rollupOutput = (target: ModuleFormat, format: string): OutputOptions => ({
  format: target,
  entryFileNames: `[name].${target === 'es' ? 'm' : target === 'cjs' ? 'c' : ''}js`,
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
const input = excludeFiles(
  glob.sync('**/*.{js,ts,vue}', {
    cwd: pkgRoot,
    ignore: ['**/*.config.*'],
    absolute: true,
  }),
);

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
    sourcemap: true,
    minify: false,
    rollupOptions: {
      input,
      external: rollupExternalFromPackage(
        cdxPackage,
        (id: string) => {
          return id.endsWith('css');
        },
        { full: false },
      ),
      treeshake: false,
      preserveEntrySignatures: 'allow-extension',
      output: [rollupOutput('es', 'es'), rollupOutput('cjs', 'lib')],
    },
  },
});
