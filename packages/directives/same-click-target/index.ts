import { useSameClickTarget } from '@cdx-component/hooks';
import { withInstallDirective } from '@cdx-component/utils';
import type { ObjectDirective } from 'vue';

type EventHanlder = (e: MouseEvent) => any;
export type SameClickTargetEl = HTMLElement & {
  mouseDownHandler: EventHanlder;
  mouseUpHandler: EventHanlder;
  clickHandler: EventHanlder;
};

export const vSameClickTarget: ObjectDirective<SameClickTargetEl, EventHanlder> = {
  mounted(el, binding) {
    const { onMouseDown, onMouseUp, onClick } = useSameClickTarget(binding.value);

    el.mouseDownHandler = onMouseDown;
    el.mouseUpHandler = onMouseUp;
    el.clickHandler = onClick;

    el.addEventListener('mousedown', el.mouseDownHandler);
    el.addEventListener('mouseup', el.mouseUpHandler);
    el.addEventListener('click', el.clickHandler);
  },
  updated(el, binding) {
    el.removeEventListener('mousedown', el.mouseDownHandler);
    el.removeEventListener('mouseup', el.mouseUpHandler);
    el.removeEventListener('click', el.clickHandler);

    const { onMouseDown, onMouseUp, onClick } = useSameClickTarget(binding.value);
    el.mouseDownHandler = onMouseDown;
    el.mouseUpHandler = onMouseUp;
    el.clickHandler = onClick;

    el.addEventListener('mousedown', el.mouseDownHandler);
    el.addEventListener('mouseup', el.mouseUpHandler);
    el.addEventListener('click', el.clickHandler);
  },
};
export const CdxSameClickTargetDirective = withInstallDirective(vSameClickTarget, 'same-click-target');
