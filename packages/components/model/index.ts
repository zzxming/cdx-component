import { withInstall } from '@cdx-component/utils';
import Model from './src/model.vue';
import { createModelInstance } from './src/service';

export * from './src/model';
export const CdxModel = withInstall(Model, {
    service: createModelInstance,
});
export default CdxModel;
