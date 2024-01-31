import { CdDrawer } from '../components/drawer';
import { CdOverlay } from '../components/overlay';
import { CdElementSelect, CdElementSelectItem } from '../components/element-select';
import type { Plugin } from '@vue/runtime-core';

export default [CdDrawer, CdOverlay, CdElementSelect, CdElementSelectItem] as Plugin[];
