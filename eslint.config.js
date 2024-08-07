import { factory } from '@zzxming/eslint-config';

export default factory({
  tailwindcss: true,
  overrides: [
    {
      rules: {
        'ts/no-unused-expressions': 'off',
      },
    },
  ],
});
