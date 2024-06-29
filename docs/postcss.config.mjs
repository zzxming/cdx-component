import { postcssIsolateStyles } from 'vitepress';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssPxtorem from 'postcss-pxtorem';

export default {
  plugins: [
    postcssIsolateStyles(),
    tailwindcss(),
    autoprefixer(),
    postcssPxtorem({
      rootValue: 16,
      propList: ['*'],
      selectorBlackList: ['*-origin'],
    }),
  ],
};
