import { CdxDrawer } from '../components/drawer';
import { CdxOverlay } from '../components/overlay';
import { CdxElementSelect, CdxElementSelectItem } from '../components/element-select';
import { CdxIcon } from '../components/icon';
import { CdxLoading, CdxLoadingDirective } from '../components/loading';
import { CdxCaptcha } from '../components/captcha';
import { CdxTextEllipsis } from '../components/text-ellipsis';
import { CdxTextHighlight } from '../components/text-highlight';

import type { Plugin } from 'vue';

export default [
    CdxDrawer,
    CdxOverlay,
    CdxElementSelect,
    CdxElementSelectItem,
    CdxIcon,
    CdxLoading,
    CdxLoadingDirective,
    CdxCaptcha,
    CdxTextEllipsis,
    CdxTextHighlight,
] as Plugin[];
