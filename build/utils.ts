import type { ProjectManifest } from '@pnpm/types';

export const getPackageManifest = (pkgPath: string) => {
    return require(pkgPath) as ProjectManifest;
};

export const rollupExternalFromPackage = (pkgPath: string, callback: (id: string) => boolean = () => false) => {
    const { dependencies, peerDependencies } = getPackageManifest(pkgPath);
    const dependenciesKeys = Object.keys(dependencies ?? {});
    const peerDependenciesKeys = Object.keys(peerDependencies ?? {});

    return (id: string) => {
        const packages = ['@vue', ...dependenciesKeys, ...peerDependenciesKeys];
        return Array.from(new Set(packages)).some((pkg) => id === pkg || id.startsWith(`${pkg}/`)) || callback(id);
    };
};
