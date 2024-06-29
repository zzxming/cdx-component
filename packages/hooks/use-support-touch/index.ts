import { cacheFunction } from '@cdx-component/utils';
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

  onMounted(() => {
    isSupportTouch.value = supportsTouchDetector();
    if (isSupportTouch.value) {
      events.value = {
        down: 'touchstart',
        move: 'touchmove',
        up: 'touchend',
      } as const;
    }
  });

  return {
    isSupportTouch,
    events,
  };
};
