import { withInstall, withInstallDirective } from '@cdx-component/utils';
import { vTooltipDirective } from './src/directive';
import ToolTip from './src/tooltip.vue';

export const CdxTooltipDirective = withInstallDirective(vTooltipDirective, 'tooltip');
export const CdxTooltip = withInstall(ToolTip, {
  directive: CdxTooltipDirective,
});
export * from './src/constants';
export * from './src/tooltip';
export * from './src/tooltip-content';
export default CdxTooltip;
