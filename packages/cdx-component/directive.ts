import type { Plugin } from 'vue';
import { CdxLoadingDirective } from '../components/loading';
import { CdxTooltipDirective } from '../components/tooltip';
import { CdxResizeDirective } from '../components/resize';
import { CdxRippleDirective, CdxSameClickTargetDirective } from '../directives';

export default [
  CdxLoadingDirective,
  CdxTooltipDirective,
  CdxResizeDirective,
  CdxSameClickTargetDirective,
  CdxRippleDirective,
] as Plugin[]; ;
