// unplugin-vue-components 自动导入插件
const toKebabCase = (key: string) => {
  const result = key.replaceAll(/([A-Z])/g, ' $1').trim();
  return result.split(' ').join('-').toLowerCase();
};

export interface ResolveOptions {
  importStyle: boolean | 'css' | 'less';
};

const getSideEffects = (dirName: string, options: Pick<ResolveOptions, 'importStyle'>) => {
  if (!options.importStyle) {
    return [];
  }
  if (options.importStyle === 'less') {
    return [
      `cdx-component/es/components/base/style/less`,
      `cdx-component/es/components/${dirName}/style/less`,
    ];
  }
  else if (options.importStyle === true || options.importStyle === 'css') {
    return [
      `cdx-component/es/components/base/style/index`,
      `cdx-component/es/components/${dirName}/style/index`,
    ];
  }
};
const resolveComponent = (name: string, options: ResolveOptions) => {
  if (!/^Cdx[A-Z]/.test(name)) return;
  const partialName = toKebabCase(name.slice(3));
  return {
    name,
    from: `cdx-component/es`,
    sideEffects: getSideEffects(partialName, options),
  };
};
const resolveDirective = (name: string, options: ResolveOptions) => {
  const directiveMap: Record<string, any> = {
    Loading: {
      importName: `CdxLoadingDirective`,
    },
    Tooltip: {
      importName: `CdxTooltipDirective`,
    },
    Ripple: {
      importName: `CdxRippleDirective`,
    },
    SameClickTarget: {
      importName: `CdxSameClickTargetDirective`,
    },
    InfinityScroll: {
      importName: `CdxInfinityScrollDirective`,
    },
  };
  const directive = directiveMap[name];
  if (!directive) return;
  const partialName = name.toLowerCase();
  return {
    name: directive.importName,
    from: `cdx-component/es`,
    sideEffects: getSideEffects(partialName, options),
  };
};

const noStyleComponents = new Set(['CdxOnlyChild']);
const noStyleDirectives = new Set(['SameClickTarget', 'InfinityScroll']);
export const CdxComponentResolver = (options: Partial<ResolveOptions> = {}) => {
  const optionsResolved = {
    importStyle: 'css',
    ...options,
  } as const;

  return [
    {
      type: 'component' as const,
      resolve: (name: string) => {
        if (noStyleComponents.has(name)) {
          return resolveComponent(name, { ...optionsResolved, importStyle: false });
        }
        return resolveComponent(name, optionsResolved);
      },
    },
    {
      type: 'directive' as const,
      resolve: (name: string) => {
        if (noStyleDirectives.has(name)) {
          return resolveDirective(name, { ...optionsResolved, importStyle: false });
        }
        return resolveDirective(name, optionsResolved);
      },
    },
  ];
};
