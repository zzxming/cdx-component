import autoprefixer from 'autoprefixer';
import postcssPxtorem from 'postcss-pxtorem';
import tailwindcss from 'tailwindcss';
import { postcssIsolateStyles } from 'vitepress';

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
