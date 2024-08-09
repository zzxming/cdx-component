import type { Plugin } from 'vue';
import { CdxLoadingDirective } from '../components/loading';
import { CdxTooltipDirective } from '../components/tooltip';
import { CdxResizeDirective } from '../components/resize';

export default [
  CdxLoadingDirective,
  CdxTooltipDirective,
  CdxResizeDirective,
] as Plugin[]; ;
