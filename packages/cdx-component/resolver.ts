// unplugin-vue-components 自动导入插件
const toKebabCase = (key: string) => {
  const result = key.replaceAll(/([A-Z])/g, ' $1').trim();
  return result.split(' ').join('-').toLowerCase();
};

const resolveComponent = (name: string) => {
  if (!/^Cdx[A-Z]/.test(name)) return;
  const partialName = toKebabCase(name.slice(3));
  return {
    name,
    from: `cdx-component/es`,
    sideEffects: [
      `cdx-component/es/components/base/style/index`,
      `cdx-component/es/components/${partialName}/style/index`,
    ],
  };
};
const resolveDirective = async (name: string) => {
  const directiveMap: Record<string, any> = {
    Loading: {},
    Tooltip: {},
  };
  if (!directiveMap[name]) return;
  const partialName = name.toLowerCase();
  return {
    name: `Cdx${name}Directive`,
    from: `cdx-component/es`,
    sideEffects: [
      `cdx-component/es/components/base/style/index`,
      `cdx-component/es/components/${partialName}/style/index`,
    ],
  };
};
export const CdxComponentResolver = () => [
  {
    type: 'component' as const,
    resolve: resolveComponent,
  },
  {
    type: 'directive' as const,
    resolve: resolveDirective,
  },
];
