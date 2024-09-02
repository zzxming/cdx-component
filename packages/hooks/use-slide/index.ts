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

  const { events, defineEventPosition } = useSupportTouch();

  const startPosition = ref([0, 0]);
  const endPosition = ref([0, 0]);
  // touchstart and touchmove passive default true, need to set false
  const eventBindOptions = computed(() => ({
    ...eventOptions,
    passive: false,
  }));
  // top, right, bottom, left
  const direction = computed(() => {
    const [x1, y1] = startPosition.value;
    const [x2, y2] = endPosition.value;
    const diffX = x2 - x1;
    const diffY = y2 - y1;
    const direction = [false, false, false, false];

    if (diffX < 0) {
      direction[1] = false;
      direction[3] = true;
    }
    else if (diffX > 0) {
      direction[1] = true;
      direction[3] = false;
    }
    else {
      direction[1] = false;
      direction[3] = false;
    }

    if (diffY < 0) {
      direction[0] = true;
      direction[2] = false;
    }
    else if (diffY > 0) {
      direction[0] = false;
      direction[2] = true;
    }
    else {
      direction[0] = false;
      direction[2] = false;
    }
    return direction;
  });
  const eventClient = computed(() => {
    const [x1, y1] = startPosition.value;
    const [x2, y2] = endPosition.value;
    return {
      clientX: x2,
      clientY: y2,
      diffX: x2 - x1,
      diffY: y2 - y1,
      startX: x1,
      startY: y1,
    };
  });

  const clearDirection = () => {
    startPosition.value = [0, 0];
    endPosition.value = [0, 0];
  };
  const moveSlide = (e: Event) => {
    preventDefault && e.preventDefault();
    const { x, y } = defineEventPosition(e);
    endPosition.value = [x, y];

    move && move(e as TouchEvent | MouseEvent, eventClient.value);
  };
  const endSlide = (e: Event) => {
    preventDefault && e.preventDefault();
    const { x, y } = defineEventPosition(e);
    endPosition.value = [x, y];
    document.removeEventListener(events.value.move, moveSlide);
    document.removeEventListener(events.value.up, endSlide);

    end && end(e as TouchEvent | MouseEvent, eventClient.value);
    clearDirection();
  };
  const startSlide = (e: Event) => {
    preventDefault && e.preventDefault();
    const { x, y } = defineEventPosition(e);
    clearDirection();
    startPosition.value = [x, y];
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
