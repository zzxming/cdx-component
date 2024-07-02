import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  root: resolve(__dirname, 'packages'),
  test: {
    clearMocks: true,
    environment: 'jsdom',
    include: ['**/__tests__/*.{test,spec}.?([cm])[jt]s?(x)'],
    exclude: ['docs/**', '**/dits/**', '**/node_modules/**'],
    coverage: {
      reporter: ['html'],
      enabled: true,
    },
  },
  plugins: [
    Vue(),
    VueJsx(),
  ],
});
