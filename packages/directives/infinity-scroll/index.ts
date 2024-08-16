import type { AnyFunction } from '@cdx-component/utils';
import { isArray, withInstallDirective } from '@cdx-component/utils';
import type { ObjectDirective } from 'vue';

const InfinityScrollData = Symbol('infinity-scroll-data');
export type InfinityScrollEl = HTMLElement & {
  [InfinityScrollData]?: {
    io: IntersectionObserver;
    watcher: HTMLElement;
    handler: AnyFunction;
  };
};
const resolveBindingValue = (value: AnyFunction | [AnyFunction, IntersectionObserverInit]) => {
  let handler = value as AnyFunction;
  let options: IntersectionObserverInit = {};
  if (isArray(value)) {
    handler = value[0];
    options = value[1];
  }
  return { handler, options };
};
const createIO = (el: InfinityScrollEl, handler: AnyFunction, options: IntersectionObserverInit) => {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && el[InfinityScrollData]?.handler) {
        el[InfinityScrollData].handler();
      }
    }
  }, { root: el, ...options });
  const watcher = document.createElement('div');
  el.appendChild(watcher);
  el[InfinityScrollData] = {
    io,
    watcher,
    handler,
  };
  io.observe(watcher);
};

export const vInfinityScroll: ObjectDirective<InfinityScrollEl, AnyFunction | [AnyFunction, IntersectionObserverInit]> = {
  mounted(el, binding) {
    const { handler, options } = resolveBindingValue(binding.value);
    createIO(el, handler, options);
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) return;
    if (el[InfinityScrollData]) {
      el[InfinityScrollData].watcher.remove();
      el[InfinityScrollData].io.disconnect();
    }
    const { handler, options } = resolveBindingValue(binding.value);
    createIO(el, handler, options);
  },
};
export const CdxInfinityScrollDirective = withInstallDirective(vInfinityScroll, 'infinity-scroll');
