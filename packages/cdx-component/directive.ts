import type { Plugin } from 'vue';
import { CdxLoadingDirective } from '../components/loading';
import { CdxTooltipDirective } from '../components/tooltip';
import { CdxResizeDirective } from '../directives';

export default [
  CdxLoadingDirective,
  CdxTooltipDirective,
  CdxResizeDirective,
] as Plugin[]; ;
