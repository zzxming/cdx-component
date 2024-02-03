import { withInstall, withInstallDirective } from '@cdx-component/utils';
import { vLoading } from './src/directive';
import Loading from './src/loading.vue';

export const CdxLoadingDirective = withInstallDirective(vLoading, 'loading');
export const CdxLoading = withInstall(Loading, {
    directive: CdxLoadingDirective,
});
export default CdxLoading;

export { Loading, vLoading };
export * from './src/loading';
