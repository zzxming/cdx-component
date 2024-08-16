import makeInstall from './makeInstall';

export * from '../components';
export * from '../directives';
export * from '../utils';
export * from '../constants';
export * from '../hooks';
export const install = makeInstall.install;
export default makeInstall;

export * from './resolver';
