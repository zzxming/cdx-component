import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import type { Ref } from 'vue';
import { useSupportTouch } from '../use-support-touch';

interface ClientPosition {
    clientX: number;
    clientY: number;
}
interface ClientDiffPosition extends ClientPosition {
    diffX: number;
    diffY: number;
}
interface Options {
    eventOptions?: AddEventListenerOptions;
    start?: (e: TouchEvent | MouseEvent, position: ClientPosition) => void;
    move?: (e: TouchEvent | MouseEvent, position: ClientDiffPosition) => void;
    end?: (e: TouchEvent | MouseEvent, position: ClientDiffPosition) => void;
}

export const useSlide = (target: Ref<HTMLElement | undefined>, options?: Options) => {
    const { eventOptions = {}, start, move, end } = options || {};

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
    const bindEvent = () => {
        if (!target.value) return;
        unbindEvent();
        target.value.addEventListener(events.value.down, startSlide, eventBindOptions.value);
    };
    const clearDirection = () => {
        direction.value.forEach((_, i) => (direction.value[i] = false));
    };
    const unbindEvent = () => {
        if (!target.value) return;
        target.value.removeEventListener(events.value.down, startSlide);
        document.removeEventListener(events.value.move, moveSlide);
        document.removeEventListener(events.value.up, endSlide);
    };
    const startSlide = (e: Event) => {
        e.preventDefault();
        const { x, y } = defineEvent(e);
        clearDirection();
        startPosition = [x, y];
        document.addEventListener(events.value.move, moveSlide, eventBindOptions.value);
        document.addEventListener(events.value.up, endSlide, eventBindOptions.value);

        start && start(e as TouchEvent | MouseEvent, { clientX: x, clientY: y });
    };
    const moveSlide = (e: Event) => {
        e.preventDefault();
        const [x1, y1] = startPosition;
        const { x: x2, y: y2 } = defineEvent(e);
        const diffX = x2 - x1;
        const diffY = y2 - y1;

        if (diffX < 0) {
            direction.value[1] = false;
            direction.value[3] = true;
        } else if (diffX > 0) {
            direction.value[1] = true;
            direction.value[3] = false;
        } else {
            direction.value[1] = false;
            direction.value[3] = false;
        }

        if (diffY < 0) {
            direction.value[0] = true;
            direction.value[2] = false;
        } else if (diffY > 0) {
            direction.value[0] = false;
            direction.value[2] = true;
        } else {
            direction.value[0] = false;
            direction.value[2] = false;
        }

        move && move(e as TouchEvent | MouseEvent, { clientX: x2, clientY: y2, diffX, diffY });
    };
    const endSlide = (e: Event) => {
        e.preventDefault();
        const { x, y } = defineEvent(e);
        document.removeEventListener(events.value.move, moveSlide);
        document.removeEventListener(events.value.up, endSlide);

        end &&
            end(e as TouchEvent | MouseEvent, {
                clientX: x,
                clientY: y,
                diffX: x - startPosition[0],
                diffY: y - startPosition[1],
            });

        startPosition = [0, 0];
        clearDirection();
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
