import { withInstallDirective } from '@cdx-component/utils';
import type { DirectiveBinding, ObjectDirective } from 'vue';
import { useBem, useZIndex } from '@cdx-component/hooks';
import { throttle } from 'lodash-unified';

const tooltipKey = Symbol('tooltip');
const distance = 4;
type ToolTipElement = HTMLElement & { [tooltipKey]: HTMLElement };
type ToolTipOptions = string;

let tooltipWrapper: HTMLElement;
const { nextZIndex } = useZIndex();
const [, bem] = useBem('tooltip');

const directions = ['top', 'right', 'bottom', 'left'] as const;
const getValidDirection = (val: any): typeof directions[number] => {
  if (!directions.includes(val)) {
    return 'top';
  }
  return val;
};
const isVisibleInWindow = ({ top, left, width, height }: { top: number; left: number; width: number; height: number }) => {
  const { innerWidth, innerHeight, scrollX, scrollY } = window;

  const isLeftWithinWindow = left > 0 && left + width < innerWidth + scrollX;
  const isTopWithinWindow = top > 0 && top + height < innerHeight + scrollY;

  return isLeftWithinWindow && isTopWithinWindow;
};

const updateTooltipPosition = (el: ToolTipElement) => {
  const tooltipContent = el[tooltipKey];
  if (!tooltipContent) return;
  let arrow = tooltipContent.querySelector(`.${bem.be('arrow')}`) as HTMLElement;
  if (!arrow) {
    arrow = document.createElement('div');
    arrow.className = bem.be('arrow');
    tooltipContent.appendChild(arrow);
  }

  const direction = getValidDirection(el.dataset.direction || '');
  const arrowRect = arrow.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const contentRect = tooltipContent.getBoundingClientRect();

  let top = window.scrollY + elRect.top;
  let left = window.scrollX + elRect.left;

  const extraPositionMap = {
    top: {
      top: -contentRect.height - arrowRect.height - distance,
      left: elRect.width / 2 - contentRect.width / 2,
      arrow: {
        top: `${contentRect.height - arrowRect.height / 2}px`,
        left: `${contentRect.width / 2 - arrowRect.width / 2}px`,
      },
    },
    right: {
      top: elRect.height / 2 - contentRect.height / 2,
      left: elRect.width + arrowRect.width / 2 + distance,
      arrow: {
        top: `${contentRect.height / 2 - arrowRect.height / 2}px`,
        left: `${-arrowRect.width / 2}px`,
      },
    },
    bottom: {
      top: contentRect.height + arrowRect.height + distance,
      left: elRect.width / 2 - contentRect.width / 2,
      arrow: {
        top: `${-arrowRect.height / 2}px`,
        left: `${contentRect.width / 2 - arrowRect.width / 2}px`,
      },
    },
    left: {
      top: elRect.height / 2 - contentRect.height / 2,
      left: -contentRect.width - arrowRect.width / 2 - distance,
      arrow: {
        top: `${contentRect.height / 2 - arrowRect.height / 2}px`,
        left: `${contentRect.width - arrowRect.width / 2}px`,
      },
    },
  } as const;
  let extra = extraPositionMap[direction];

  if (!isVisibleInWindow({ top: top + extra.top, left: left + extra.left, width: contentRect.width, height: contentRect.height })) {
    const reverseDirection = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    } as const;
    extra = extraPositionMap[reverseDirection[direction]];
  }

  top += extra.top;
  left += extra.left;
  Object.assign(arrow.style, extra.arrow);
  Object.assign(tooltipContent.style, {
    zIndex: String(nextZIndex()),
    top: `${top}px`,
    left: `${left}px`,
  });
};
const updateTooltipValue = (el: ToolTipElement, binding: DirectiveBinding<ToolTipOptions>) => {
  const tooltipContent = el[tooltipKey];
  let tooltipText = tooltipContent.querySelector('span');
  if (!tooltipText) {
    tooltipText = document.createElement('span');
    tooltipContent.insertBefore(tooltipText, tooltipContent.firstChild);
  }
  el.dataset.direction = getValidDirection(binding.arg || '');
};
const createTooltip = (el: ToolTipElement, binding: DirectiveBinding<ToolTipOptions>) => {
  if (!tooltipWrapper) {
    tooltipWrapper = document.createElement('div');
    tooltipWrapper.className = bem.be('wrapper');
    document.body.appendChild(tooltipWrapper);
  }
  const tooltipContent = document.createElement('div');
  tooltipContent.className = `${bem.b()} ${bem.bm('hidden')}`;
  const tooltipText = document.createElement('span');
  tooltipText.textContent = binding.value;

  const arrow = document.createElement('div');
  arrow.className = bem.be('arrow');

  tooltipContent.appendChild(tooltipText);
  tooltipContent.appendChild(arrow);
  tooltipWrapper.appendChild(tooltipContent);
  el[tooltipKey] = tooltipContent;

  updateTooltipValue(el, binding);
  updateTooltipPosition(el);
  return tooltipContent;
};

export const vTooltipDirective: ObjectDirective<ToolTipElement> = {
  mounted(el, binding) {
    const tooltipContent = createTooltip(el, binding);
    el.addEventListener('mouseenter', () => {
      tooltipContent.classList.remove(bem.bm('hidden'));
      updateTooltipPosition(el);
    });
    el.addEventListener('mouseleave', throttle(() => {
      tooltipContent.classList.add(bem.bm('hidden'));
    }, 300));
  },
  updated(el, binding) {
    updateTooltipValue(el, binding);
  },
};

export const CdxVTooltip = withInstallDirective(vTooltipDirective, 'tooltip');
