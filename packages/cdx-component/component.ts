import { CdxDrawer } from '../components/drawer';
import { CdxOverlay } from '../components/overlay';
import { CdxElementSelect, CdxElementSelectItem } from '../components/element-select';
import { CdxIcon } from '../components/icon';
import { CdxLoading, CdxLoadingDirective } from '../components/loading';
import { CdxCaptcha } from '../components/captcha';
import type { Plugin } from '@vue/runtime-core';

export default [
    CdxDrawer,
    CdxOverlay,
    CdxElementSelect,
    CdxElementSelectItem,
    CdxIcon,
    CdxLoading,
    CdxLoadingDirective,
    CdxCaptcha,
] as Plugin[];
