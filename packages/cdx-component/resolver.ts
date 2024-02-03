// unplugin-vue-components 自动导入插件

const kebabCase = (key: string) => {
    const result = key.replace(/([A-Z])/g, ' $1').trim();
    return result.split(' ').join('-').toLowerCase();
};
const resolveComponent = (name: string) => {
    if (!name.match(/^Cdx[A-Z]/)) return;
    const partialName = kebabCase(name.slice(3));
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
        type: 'component' as 'component',
        resolve: resolveComponent,
    },
    {
        type: 'directive' as 'directive',
        resolve: resolveDirective,
    },
];
