import { cacheFunction, tryOnScope } from '@cdx-component/utils';
import { onMounted, ref } from 'vue';

type SupportEventName = 'down' | 'move' | 'up';
const supportsTouchDetector = cacheFunction<boolean>(() => 'ontouchstart' in window);

export const useSupportTouch = () => {
  const isSupportTouch = ref(false);
  const events = ref<{ [key in SupportEventName]: keyof HTMLElementEventMap }>({
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
  } as const);

  tryOnScope(onMounted, () => {
    isSupportTouch.value = supportsTouchDetector();
    if (isSupportTouch.value) {
      events.value = {
        down: 'touchstart',
        move: 'touchmove',
        up: 'touchend',
      } as const;
    }
  });

  const defineEventPosition = (e: Event) => {
    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;
    const moveToX = isSupportTouch.value ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
    const moveToY = isSupportTouch.value ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY;
    return {
      x: moveToX,
      y: moveToY,
    };
  };

  return {
    isSupportTouch,
    events,
    defineEventPosition,
  };
};
