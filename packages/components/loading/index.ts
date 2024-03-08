import { withInstall, withInstallDirective } from '@cdx-component/utils';
import { vLoading as vLoadingDirective } from './src/directive';
import { vLoading as vLoadingService } from './src/service';
import Loading from './src/loading.vue';

export const CdxLoadingDirective = withInstallDirective(vLoadingDirective, 'loading');
export const CdxLoading = withInstall(Loading, {
    directive: CdxLoadingDirective,
    service: vLoadingService,
});
export * from './src/loading';
export * from './src/constants';
export default CdxLoading;
