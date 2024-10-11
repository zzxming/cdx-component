import { withInstall, withInstallDirective } from '@cdx-component/utils';
import { vLoading as vLoadingDirective } from './src/directive';
import Loading from './src/loading.vue';
import loadingIcon from './src/loading-icon.vue';
import { vLoading as vLoadingService } from './src/service';

export const CdxLoadingDirective = withInstallDirective(vLoadingDirective, 'loading');
export const CdxLoading = withInstall(Loading, {
  directive: CdxLoadingDirective,
  service: vLoadingService,
});
export const CdxLoadingIcon = withInstall(loadingIcon);
export * from './src/constants';
export * from './src/loading';
export default CdxLoading;
