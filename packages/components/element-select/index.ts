import { withInstall } from '@cdx-component/utils';
import ElementSelect from './src/element-select.vue';
import ElementSelectItem from './src/element-select-item.vue';

export const CdxElementSelect = withInstall(ElementSelect);
export const CdxElementSelectItem = withInstall(ElementSelectItem);
export * from './src/element-select';
export * from './src/element-select-item';
export * from './src/constants';
export default CdxElementSelect;
