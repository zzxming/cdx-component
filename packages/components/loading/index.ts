import { withInstall, withInstallDirective } from '@cdx-component/utils';
import { vLoading as vLoadingDirective } from './src/directive';
import { createLoadingInstance, vLoading as CdxLoadingService } from './src/service';
import Loading from './src/loading.vue';

export * from './src/loading';
export * from './src/constants';
export const CdxLoadingDirective = withInstallDirective(vLoadingDirective, 'loading');
export const CdxLoading = withInstall(Loading, {
    directive: CdxLoadingDirective,
    service: CdxLoadingService,
});
export default CdxLoading;

export { CdxLoadingService, createLoadingInstance };
