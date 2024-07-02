import { factory } from '@zzxming/eslint-config';

export default factory({
  tailwindcss: true,
  overrides: [
    {
      name: 'unicorn/disables/test',
      files: ['**/__tests__/*'],
      rules: {
        'unicorn/no-useless-undefined': 'off',
      },
    },
  ],
});
