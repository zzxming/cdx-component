import type { App, ObjectDirective, Ref } from 'vue';
import { createApp, h, provide, ref } from 'vue';
import { type Direction, RESIZE_INJECTION_KEY } from './constants';
import ResizeDragger from './resize-dragger.vue';

export const RESIZE_INSTANCE_KEY = Symbol('resize-instance');
export const RESIZE_DATA_KEY = Symbol('resize-data');

export type HTMLEResizeElement = HTMLElement & {
  [RESIZE_DATA_KEY]?: {
    directions: Ref<Direction[]>;
  };
  [RESIZE_INSTANCE_KEY]?: App;
};

const createResizeHandlers = (el: HTMLEResizeElement, directions: Direction[]) => {
  const directionsRef = ref(directions);

  const resizeDraggerInstance = createApp({
    setup() {
      const contentRef = ref(el);

      provide(RESIZE_INJECTION_KEY, {
        contentRef,
      });

      return () => {
        return directionsRef.value.map(direction => h(ResizeDragger, { direction }));
      };
    },
  });
  resizeDraggerInstance.mount(document.createElement('div'));
  el[RESIZE_DATA_KEY] = {
    directions: directionsRef,
  };
  el[RESIZE_INSTANCE_KEY] = resizeDraggerInstance;
};

export const vResizeDirective: ObjectDirective<HTMLEResizeElement> = {
  mounted(el, binding) {
    const directions: Direction[] = [];
    if (binding.modifiers.top) directions.push('top');
    if (binding.modifiers.left) directions.push('left');
    if (binding.modifiers.right) directions.push('right');
    if (binding.modifiers.bottom) directions.push('bottom');
    createResizeHandlers(el, directions);
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) return;
    const directions: Direction[] = [];
    if (binding.modifiers.top) directions.push('top');
    if (binding.modifiers.left) directions.push('left');
    if (binding.modifiers.right) directions.push('right');
    if (binding.modifiers.bottom) directions.push('bottom');
    el[RESIZE_DATA_KEY]!.directions.value = directions;
  },
  beforeUnmount(el) {
    const instance = el[RESIZE_INSTANCE_KEY]!;
    instance.unmount();
    delete el[RESIZE_INSTANCE_KEY];
  },
};
