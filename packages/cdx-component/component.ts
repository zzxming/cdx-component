import type { Plugin } from 'vue';
import { CdxButton } from '../components/button';
import { CdxCaptcha, CdxCaptchaSlider } from '../components/captcha';
import { CdxCollapse, CdxCollapseItem } from '../components/collapse';
import { CdxCollapseTransition } from '../components/collapse-transition';
import { CdxColorPicker } from '../components/color-picker';
import { CdxCountTo } from '../components/count-to';
import { CdxDrawer } from '../components/drawer';
import { CdxElementSelect, CdxElementSelectItem } from '../components/element-select';
import { CdxIcon } from '../components/icon';
import { CdxLoading, CdxLoadingIcon } from '../components/loading';
import { CdxMenu, CdxMenuItem } from '../components/menu';
import { CdxModel } from '../components/model';
import { CdxOnlyChild } from '../components/only-child';
import { CdxOverlay } from '../components/overlay';
import { CdxPullRefresh } from '../components/pull-refresh';
import { CdxResize } from '../components/resize';
import { CdxScrollbar } from '../components/scrollbar';
import { CdxSidebar } from '../components/sidebar';
import { CdxTabs } from '../components/tabs';
import { CdxTextConvert } from '../components/text-convert';
import { CdxTextEllipsis } from '../components/text-ellipsis';
import { CdxTextHighlight } from '../components/text-highlight';
import { CdxTooltip } from '../components/tooltip';

export default [
  CdxDrawer,
  CdxOverlay,
  CdxElementSelect,
  CdxElementSelectItem,
  CdxIcon,
  CdxLoading,
  CdxLoadingIcon,
  CdxCaptcha,
  CdxCaptchaSlider,
  CdxTextEllipsis,
  CdxTextHighlight,
  CdxModel,
  CdxCountTo,
  CdxCollapse,
  CdxCollapseItem,
  CdxCollapseTransition,
  CdxPullRefresh,
  CdxTooltip,
  CdxOnlyChild,
  CdxResize,
  CdxSidebar,
  CdxButton,
  CdxTabs,
  CdxScrollbar,
  CdxColorPicker,
  CdxMenu,
  CdxMenuItem,
  CdxTextConvert,
] as Plugin[];
