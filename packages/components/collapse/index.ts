import { withInstall } from '@cdx-component/utils';
import Collapse from './src/collapse.vue';
import CollapseItem from './src/collapse-item.vue';

export const CdxCollapse = withInstall(Collapse);
export const CdxCollapseItem = withInstall(CollapseItem);
export * from './src/collapse';
export * from './src/collapse-item';
export default CdxCollapse;
