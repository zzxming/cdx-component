import { resolve } from 'node:path';
import { buildOutput, buildRoot, pkgRoot } from './constants';
// import type { ProjectManifest } from '@pnpm/types';

export const getPackageManifest = (pkgPath: string) => {
  // TODO
  // 使用 @pnpm/types 会出现 unbuild build 出现 cannot find module
  // return require(pkgPath) as ProjectManifest;

  // eslint-disable-next-line ts/no-require-imports
  return require(pkgPath);
};

export const rollupExternalFromPackage = (
  pkgPath: string,
  callback: (id: string) => boolean = () => false,
  options: { full: boolean },
) => {
  const { dependencies, peerDependencies } = getPackageManifest(pkgPath);
  const dependenciesKeys = Object.keys(dependencies ?? {});
  const peerDependenciesKeys = Object.keys(peerDependencies ?? {});

  return (id: string) => {
    const packages = [...peerDependenciesKeys];
    if (!options.full) {
      packages.push('@vue', ...dependenciesKeys);
    }
    return Array.from(new Set(packages)).some(pkg => id === pkg || id.startsWith(`${pkg}/`)) || callback(id);
  };
};

export const beforeWriteFile = (target: string) => {
  return (filePath: string, content: string) => {
    if (['gulpfile', 'build'].some(exclude => filePath.includes(exclude))) return false;
    // rollup 打包根为 cdx-component, 打包后文件需同步 d.ts 出现在根, 并处理相对路径
    if (filePath.includes(`/${target}/cdx-component/`)) {
      return {
        filePath: filePath.replace(`/${target}/cdx-component/`, `/${target}/`),
        content: content.replaceAll('../', './'),
      };
    }
  };
};

export const dtsConfig = (target: string) => {
  return {
    entryRoot: pkgRoot,
    outDir: resolve(buildOutput, target),
    tsconfigPath: resolve(buildRoot, 'tsconfig.json'),
    beforeWriteFile: beforeWriteFile(target),
  };
};
