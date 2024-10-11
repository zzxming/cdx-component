import { withInstall, withInstallDirective } from '@cdx-component/utils';
import { vResizeDirective } from './src/direcitve';
import Resize from './src/resize.vue';

export const CdxResizeDirective = withInstallDirective(vResizeDirective, 'resize');
export const CdxResize = withInstall(Resize, {
  directive: CdxResizeDirective,
});
export * from './src/constants';
export * from './src/resize';
export * from './src/resize-dragger';
export default CdxResize;
