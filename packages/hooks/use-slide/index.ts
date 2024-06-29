import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useSupportTouch } from '../use-support-touch';

interface ClientPosition {
  clientX: number;
  clientY: number;
}
interface ClientDiffPosition extends ClientPosition {
  diffX: number;
  diffY: number;
  startX: number;
  startY: number;
}
interface Options {
  preventDefault?: boolean;
  eventOptions?: AddEventListenerOptions;
  start?: (e: TouchEvent | MouseEvent, position: ClientPosition) => void;
  move?: (e: TouchEvent | MouseEvent, position: ClientDiffPosition) => void;
  end?: (e: TouchEvent | MouseEvent, position: ClientDiffPosition) => void;
}

export const useSlide = (target: Ref<HTMLElement | undefined>, options?: Options) => {
  const { preventDefault = true, eventOptions = {}, start, move, end } = options || {};

  const { isSupportTouch, events } = useSupportTouch();

  let startPosition: [number, number] = [0, 0];
  // top, right, bottom, left
  const direction = ref([false, false, false, false]);
  // touchstart and touchmove passive default true, need to set false
  const eventBindOptions = computed(() => ({
    ...eventOptions,
    passive: false,
  }));

  const defineEvent = (e: Event) => {
    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;
    const moveToX = isSupportTouch.value ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
    const moveToY = isSupportTouch.value ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY;
    return {
      x: moveToX,
      y: moveToY,
    };
  };
  const clearDirection = () => {
    for (const [i, _] of direction.value.entries()) (direction.value[i] = false);
  };
  const moveSlide = (e: Event) => {
    preventDefault && e.preventDefault();
    const [x1, y1] = startPosition;
    const { x: x2, y: y2 } = defineEvent(e);
    const diffX = x2 - x1;
    const diffY = y2 - y1;

    if (diffX < 0) {
      direction.value[1] = false;
      direction.value[3] = true;
    }
    else if (diffX > 0) {
      direction.value[1] = true;
      direction.value[3] = false;
    }
    else {
      direction.value[1] = false;
      direction.value[3] = false;
    }

    if (diffY < 0) {
      direction.value[0] = true;
      direction.value[2] = false;
    }
    else if (diffY > 0) {
      direction.value[0] = false;
      direction.value[2] = true;
    }
    else {
      direction.value[0] = false;
      direction.value[2] = false;
    }

    move && move(e as TouchEvent | MouseEvent, { clientX: x2, clientY: y2, diffX, diffY, startX: x1, startY: y1 });
  };
  const endSlide = (e: Event) => {
    preventDefault && e.preventDefault();
    const [x1, y1] = startPosition;
    const { x, y } = defineEvent(e);
    document.removeEventListener(events.value.move, moveSlide);
    document.removeEventListener(events.value.up, endSlide);

    end && end(e as TouchEvent | MouseEvent, {
      clientX: x,
      clientY: y,
      diffX: x - x1,
      diffY: y - y1,
      startX: x1,
      startY: y1,
    });

    startPosition = [0, 0];
    clearDirection();
  };
  const startSlide = (e: Event) => {
    preventDefault && e.preventDefault();
    const { x, y } = defineEvent(e);
    clearDirection();
    startPosition = [x, y];
    document.addEventListener(events.value.move, moveSlide, eventBindOptions.value);
    document.addEventListener(events.value.up, endSlide, eventBindOptions.value);

    start && start(e as TouchEvent | MouseEvent, { clientX: x, clientY: y });
  };
  const unbindEvent = () => {
    if (!target.value) return;
    target.value.removeEventListener(events.value.down, startSlide);
    document.removeEventListener(events.value.move, moveSlide);
    document.removeEventListener(events.value.up, endSlide);
  };
  const bindEvent = () => {
    if (!target.value) return;
    unbindEvent();
    target.value.addEventListener(events.value.down, startSlide, eventBindOptions.value);
  };

  onMounted(() => {
    bindEvent();
  });
  onBeforeUnmount(() => {
    unbindEvent();
  });

  return {
    direction,
    unbindEvent,
  };
};
