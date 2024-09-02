import { factory } from '@zzxming/eslint-config';

export default factory({
  tailwindcss: true,
  vitest: {
    files: ['**/__tests__/*.{test,spec}.?([cm])[jt]s?(x)', '**/__tests__/*.{test,spec}-d.?([cm])[jt]s?(x)'],
  },
  overrides: [
    {
      rules: {
        'ts/no-unused-expressions': 'off',

        'vitest/prefer-lowercase-title': 'off',
      },
    },
    {
      files: ['**/__tests__/*.{test,spec}-d.?([cm])[jt]s?(x)'],
      rules: {
        'vitest/expect-expect': 'off',
      },
    },
  ],
});
