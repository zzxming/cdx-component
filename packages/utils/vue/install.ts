import type { App, Component, Directive, Plugin } from 'vue';

export type SFCWithInstall<T> = T & Plugin;

export const withInstall = <T extends Component, E extends Record<string, any>>(main: T, extra?: E) => {
  (main as SFCWithInstall<T>).install = (app: App): void => {
    app.component(main.name!, main);
  };

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp;
    }
  }
  return main as SFCWithInstall<T> & E;
};
export const withInstallDirective = <T extends Directive>(directive: T, name: string) => {
  (directive as SFCWithInstall<T>).install = (app: App): void => {
    app.directive(name, directive);
  };

  return directive as SFCWithInstall<T>;
};
