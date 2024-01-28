export * from '@cdx-component/components';
export * from '@cdx-component/utils';
export * from '@cdx-component/constants';

import makeInstall from './makeInstall';
export const install = makeInstall.install;
export default makeInstall;

export * from './resolver';
