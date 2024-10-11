import makeInstall from './makeInstall';

export * from '../components';
export * from '../constants';
export * from '../directives';
export * from '../hooks';
export * from '../utils';
export const install = makeInstall.install;
export default makeInstall;

export * from './resolver';
