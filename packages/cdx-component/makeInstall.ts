import type { App, Plugin } from 'vue';
import { INSTALLED_KEY } from '../constants';
import Components from './component';

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    if (app[INSTALLED_KEY]) return;

    app[INSTALLED_KEY] = true;
    for (const c of components) app.use(c);
  };

  return {
    install,
  };
};

export default makeInstaller(Components);
