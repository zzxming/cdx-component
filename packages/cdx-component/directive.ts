import type { Plugin } from 'vue';
import { CdxLoadingDirective } from '../components/loading';
import { CdxTooltipDirective } from '../components/tooltip';

export default [
  CdxLoadingDirective,
  CdxTooltipDirective,
] as Plugin[]; ;
