import { withInstall } from '@cdx-component/utils';
import Model from './src/model.vue';
import { createModelInstance } from './src/service';

export const CdxModel = withInstall(Model, {
    service: createModelInstance,
});
export * from './src/model';
export default CdxModel;
