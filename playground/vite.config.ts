import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const projRoot = path.resolve(__dirname, '..');

export default defineConfig({
  resolve: {
    alias: [
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
  plugins: [vue()],
  server: {
    port: 5172,
    host: '0.0.0.0',
  },
});
