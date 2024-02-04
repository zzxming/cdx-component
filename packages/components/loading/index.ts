import { withInstall, withInstallDirective } from '@cdx-component/utils';
import { vLoading as vLoadingDirective } from './src/directive';
import { vLoading as CdxLoadingService } from './src/service';
import Loading from './src/loading.vue';

export const CdxLoadingDirective = withInstallDirective(vLoadingDirective, 'loading');
export const CdxLoading = withInstall(Loading, {
    directive: CdxLoadingDirective,
    service: CdxLoadingService,
});
export default CdxLoading;

export { Loading, CdxLoadingService };
export * from './src/loading';
