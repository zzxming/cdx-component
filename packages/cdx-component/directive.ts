import type { Plugin } from 'vue';
import { CdxLoadingDirective } from '../components/loading';
import { CdxResizeDirective } from '../components/resize';
import { CdxTooltipDirective } from '../components/tooltip';
import {
  CdxInfinityScrollDirective,
  CdxRippleDirective,
  CdxSameClickTargetDirective,
} from '../directives';

export default [
  CdxLoadingDirective,
  CdxTooltipDirective,
  CdxResizeDirective,
  CdxSameClickTargetDirective,
  CdxRippleDirective,
  CdxInfinityScrollDirective,
] as Plugin[];
