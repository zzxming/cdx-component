import { supportsTouchDetector, tryOnScope } from '@cdx-component/utils';
import { onMounted, ref } from 'vue';

type SupportEventName = 'down' | 'move' | 'up';

/**
 * @param isSupport is support when context is not in lifecycle
 */
export const useSupportTouch = (isSupport: boolean = false) => {
  const isSupportTouch = ref(isSupport);
  const events = ref<{ [key in SupportEventName]: keyof HTMLElementEventMap }>({
    down: isSupportTouch.value ? 'touchstart' : 'mousedown',
    move: isSupportTouch.value ? 'touchmove' : 'mousemove',
    up: isSupportTouch.value ? 'touchend' : 'mouseup',
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
