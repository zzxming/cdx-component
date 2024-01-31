import type { App, Plugin } from '@vue/runtime-core';
import Components from './component';
import { INSTALLED_KEY } from '../constants';

export const makeInstaller = (components: Plugin[] = []) => {
    const install = (app: App) => {
        if (app[INSTALLED_KEY]) return;

        app[INSTALLED_KEY] = true;
        components.forEach((c) => app.use(c));
    };

    return {
        install,
    };
};

export default makeInstaller(Components);
