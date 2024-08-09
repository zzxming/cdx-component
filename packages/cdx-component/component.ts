import type { Plugin } from 'vue';
import { CdxDrawer } from '../components/drawer';
import { CdxOverlay } from '../components/overlay';
import { CdxElementSelect, CdxElementSelectItem } from '../components/element-select';
import { CdxIcon } from '../components/icon';
import { CdxLoading } from '../components/loading';
import { CdxCaptcha, CdxCaptchaSlider } from '../components/captcha';
import { CdxTextEllipsis } from '../components/text-ellipsis';
import { CdxTextHighlight } from '../components/text-highlight';
import { CdxModel } from '../components/model';
import { CdxCountTo } from '../components/count-to';
import { CdxCollapse, CdxCollapseItem } from '../components/collapse';
import { CdxCollapseTransition } from '../components/collapse-transition';
import { CdxPullRefresh } from '../components/pull-refresh';
import { CdxTooltip } from '../components/tooltip';
import { CdxOnlyChild } from '../components/only-child';
import { CdxResize } from '../components/resize';

export default [
  CdxDrawer,
  CdxOverlay,
  CdxElementSelect,
  CdxElementSelectItem,
  CdxIcon,
  CdxLoading,
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
] as Plugin[];
