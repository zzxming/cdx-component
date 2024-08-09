import { withInstall, withInstallDirective } from '@cdx-component/utils';
import Resize from './src/resize.vue';
import { vResizeDirective } from './src/direcitve';

export const CdxResizeDirective = withInstallDirective(vResizeDirective, 'resize');
export const CdxResize = withInstall(Resize, {
  directive: CdxResizeDirective,
});
export * from './src/resize';
export * from './src/resize-dragger';
export * from './src/constants';
export default CdxResize;
