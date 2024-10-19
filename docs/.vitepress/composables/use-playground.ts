import { utoa } from '../utils';

const MAIN_FILE_NAME = 'App.vue';

export const usePlayground = (mainFileName: string, fileNames: string[], codes: string[]) => {
  const files = fileNames.reduce((pre, cur, i) => {
    if (cur === mainFileName) {
      pre[MAIN_FILE_NAME] = codes[i];
    }
    else {
      pre[cur] = codes[i];
    }
    return pre;
  }, {});
  const originCode = {
    ...files,
    __versions: {
      'cdx-component': 'latest',
      'vue': '3.3.11',
      'typescript': 'latest',
    },
  };
  const encoded = utoa(JSON.stringify(originCode));
  const link = `https://zzxming.github.io/cdx-component-playground/#${encoded}`;
  return {
    encoded,
    link,
  };
};
