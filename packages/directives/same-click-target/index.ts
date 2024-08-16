import { useSameClickTarget } from '@cdx-component/hooks';
import { withInstallDirective } from '@cdx-component/utils';
import type { DirectiveBinding, ObjectDirective } from 'vue';

const EventHandlers = Symbol('same-click-target-handlers');
export type SameClickTargetEl = HTMLElement & {
  [EventHandlers]?: {
    mousedown: EventListener;
    mouseup: EventListener;
    click: EventListener;
  };
};

const bindHandler = (el: SameClickTargetEl, binding: DirectiveBinding<EventListener>) => {
  const { onMouseDown, onMouseUp, onClick } = useSameClickTarget(binding.value);
  el[EventHandlers] = {
    mousedown: onMouseDown,
    mouseup: onMouseUp,
    click: onClick,
  };
  for (const [event, handler] of Object.entries(el[EventHandlers])) {
    el.addEventListener(event, handler);
  }
};
const unbindHandler = (el: SameClickTargetEl) => {
  if (!el[EventHandlers]) return;
  for (const [event, handler] of Object.entries(el[EventHandlers])) {
    el.removeEventListener(event, handler);
  }
  delete el[EventHandlers];
};

export const vSameClickTarget: ObjectDirective<SameClickTargetEl, EventListener> = {
  mounted: bindHandler,
  updated(el, binding) {
    if (binding.value === binding.oldValue) return;
    unbindHandler(el);
    bindHandler(el, binding);
  },
};
export const CdxSameClickTargetDirective = withInstallDirective(vSameClickTarget, 'same-click-target');
