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
    const event = isSupportTouch.value ? touchEvent.changedTouches[0] : mouseEvent;
    const { clientX, clientY, pageX, pageY } = event;
    return {
      x: clientX,
      y: clientY,
      clientX,
      clientY,
      pageX,
      pageY,
    };
  };

  return {
    isSupportTouch,
    events,
    defineEventPosition,
  };
};
