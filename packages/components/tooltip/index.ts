import { withInstall, withInstallDirective } from '@cdx-component/utils';
import { vTooltipDirective } from './src/directive';
import ToolTip from './src/tooltip.vue';
import TooltipContent from './src/tooltip-content.vue';

export const CdxTooltipContent = withInstall(TooltipContent);
export const CdxTooltipDirective = withInstallDirective(vTooltipDirective, 'tooltip');
export const CdxTooltip = withInstall(ToolTip, {
  directive: CdxTooltipDirective,
});
export * from './src/tooltip';
export * from './src/tooltip-content';
export * from './src/constants';
export default CdxTooltip;
