import { resolve } from 'path';

export const projRoot = resolve(__dirname, '..');
export const pkgRoot = resolve(projRoot, 'packages');
export const cdRoot = resolve(pkgRoot, 'cdx-component');
export const buildOutput = resolve(projRoot, 'dist');

export const PKG_PREFIX = '@cdx-component';
export const PKG_NAME = 'cdx-component';
