export * from '../components';
export * from '../utils';
export * from '../constants';
export * from '../hooks';

import makeInstall from './makeInstall';
export const install = makeInstall.install;
export default makeInstall;

export * from './resolver';
