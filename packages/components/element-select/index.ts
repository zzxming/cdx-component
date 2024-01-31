import ElementSelect from './src/element-select.vue';
import ElementSelectItem from './src/element-select-item.vue';
import { withInstall } from '@cdx-component/utils';

export const CdElementSelect = withInstall(ElementSelect);
export const CdElementSelectItem = withInstall(ElementSelectItem);

export * from './src/element-select';
export * from './src/element-select-item';
export * from './src/constants';

export default CdElementSelect;
