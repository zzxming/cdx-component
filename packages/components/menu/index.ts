import { withInstall } from '@cdx-component/utils';
import Menu from './src/menu.vue';
import MenuItem from './src/menu-item.vue';

export const CdxMenu = withInstall(Menu);
export const CdxMenuItem = withInstall(MenuItem);
export * from './src/menu';
export * from './src/menu-item';
export default CdxMenu;
