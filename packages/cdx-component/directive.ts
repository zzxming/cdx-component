import type { Plugin } from 'vue';
import { CdxLoadingDirective } from '../components/loading';
import { CdxTooltipDirective } from '../components/tooltip';
import { CdxResizeDirective } from '../components/resize';
import {
  CdxInfinityScrollDirective,
  CdxRippleDirective
  , CdxSameClickTargetDirective,
} from '../directives';

export default [
  CdxLoadingDirective,
  CdxTooltipDirective,
  CdxResizeDirective,
  CdxSameClickTargetDirective,
  CdxRippleDirective,
  CdxInfinityScrollDirective,
] as Plugin[]; ;
