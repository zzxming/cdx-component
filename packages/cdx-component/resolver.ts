// unplugin-vue-components 自动导入插件

const kebabCase = (key: string) => {
    const result = key.replace(/([A-Z])/g, ' $1').trim();
    return result.split(' ').join('-').toLowerCase();
};

export const CdComponentResolver = () => (name: string) => {
    if (!name.match(/^Cd[A-Z]/)) return;
    const partialName = kebabCase(name.slice(2));
    return {
        name,
        from: `cdx-component/es`,
        sideEffects: [
            `cdx-component/es/components/base/style/index`,
            `cdx-component/es/components/${partialName}/style/index`,
        ],
    };
};
