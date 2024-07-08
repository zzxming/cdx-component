import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  root: resolve(__dirname, 'packages'),
  test: {
    clearMocks: true,
    environment: 'jsdom',
    include: ['**/__tests__/*.{test,spec}.?([cm])[jt]s?(x)', '**/__tests__/*.{test,spec}-d.?([cm])[jt]s?(x)'],
    exclude: ['**/dits/**', '**/node_modules/**'],
    coverage: {
      reportsDirectory: resolve(__dirname, 'coverage'),
      reporter: ['html'],
      enabled: true,
    },
    typecheck: {
      include: ['**/__tests__/*.{test,spec}-d.?([cm])[jt]s?(x)'],
      enabled: true,
    },
  },
  plugins: [
    Vue(),
    VueJsx(),
  ],
});
