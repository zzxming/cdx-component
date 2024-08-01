import type { App, Plugin } from '@vue/runtime-core';
import { INSTALLED_KEY } from '../constants';
import Components from './component';
import Directives from './directive';

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    if (app[INSTALLED_KEY]) return;

    app[INSTALLED_KEY] = true;
    for (const c of components) {
      app.use(c);
    }
  };

  return {
    install,
  };
};

export default makeInstaller([...Components, ...Directives]);
