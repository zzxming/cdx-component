import { resolve } from 'node:path';

export const projRoot = resolve(__dirname, '../../../');
export const pkgRoot = resolve(projRoot, 'packages');
export const docsRoot = resolve(projRoot, 'docs');
export const cdxRoot = resolve(pkgRoot, 'cdx-component');
export const componentRoot = resolve(pkgRoot, 'components');
export const themeRoot = resolve(pkgRoot, 'theme');
export const buildRoot = resolve(projRoot, 'internal/build');
export const buildOutput = resolve(projRoot, 'dist');

export const PKG_PREFIX = '@cdx-component';
export const PKG_NAME = 'cdx-component';

export const cdxPackage = resolve(cdxRoot, 'package.json');
