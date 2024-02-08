import { withInstall } from '@cdx-component/utils';
import Model from './src/model.vue';

export * from './src/model';
export const CdxModel = withInstall(Model);
export default CdxModel;
