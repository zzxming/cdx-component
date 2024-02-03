<script setup lang="ts">
import { computed, ref, onMounted, Teleport, type StyleValue } from 'vue';
import { CdxOverlay } from '@cdx-component/components';
import { isNumber, cacheFunction } from '@cdx-component/utils';
import { DrawerProps, drawerEmits } from './drawer';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';

type HTMLElementEventName = keyof HTMLElementEventMap;
const props = withDefaults(defineProps<DrawerProps>(), {
    direction: 'left',
    fullscreen: false,
    slide: true,
    clickModelCose: true,
    breakBoundart: 16,
    size: '68%',
    bodySlide: true,
});
const emits = defineEmits(drawerEmits);
const slots = defineSlots<{
    default(): any;
    swipe?(): any;
}>();

const canSlide = computed(() => !props.fullscreen && slots.swipe && props.slide);
const isHorizontal = computed(() => ['left', 'right'].includes(props.direction));
const isPositiveDirection = computed(() => ['left', 'top'].includes(props.direction));
const stopBodyEvent = computed(() => [handledEvents.value.down]);
const bodySlideEvent = computed(() => {
    const events = {} as { [key in HTMLElementEventName]: Function };
    if (!props.bodySlide) {
        const stopFunc = (e: Event) => e.stopPropagation();
        for (const key of stopBodyEvent.value) {
            events[key] = stopFunc;
        }
    }
    return events;
});
const slideName = ref('fade');
const drawerContentStyle = computed<StyleValue>(() => {
    const styleMap = {
        left: 'right',
        right: 'left',
        top: 'bottom',
        bottom: 'top',
        size: isHorizontal.value ? 'width' : 'height',
    };
    return {
        position: props.fullscreen ? 'fixed' : 'absolute',
        [props.direction]: 'auto',
        [`padding-${styleMap[props.direction]}`]: `${props.breakBoundart}px`,
        [`margin-${styleMap[props.direction]}`]: `-${props.breakBoundart}px`,
        [styleMap.size]: isNumber(props.size) ? `${props.size}px` : props.size,
    };
});
const drawerContentClassName = computed(() => {
    const className = {
        right: 'ltr',
        left: 'rtl',
        top: 'btt',
        bottom: 'ttb',
    };
    return `${className[props.direction]}`;
});

const visible = ref(false);
const model = computed({
    get() {
        return props.modelValue || visible.value;
    },
    set(value) {
        visible.value = value;
        emits(UPDATE_MODEL_EVENT, value);
    },
});
const close = () => {
    if (canSlide.value || !props.clickModelCose) return;
    model.value = false;
};

const changeVisible = ref(false);
const drawerContentSize = ref<DOMRect>();
const drawerSwipeRef = ref<HTMLElement>();
const drawerContentRef = ref<HTMLElement>();
const startPosition = ref<[number, number]>();
const handleDown = (e: Event) => {
    if (!canSlide.value) return;
    const isSupportsTouch = supportsTouchDetector();
    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;
    drawerContentSize.value = drawerSwipeRef.value!.getBoundingClientRect();
    startPosition.value = [
        isSupportsTouch ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX,
        isSupportsTouch ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY,
    ];

    document.addEventListener(handledEvents.value.move, handleMove);
    document.addEventListener(handledEvents.value.up, handleUp);
};
const handleMove = (e: Event) => {
    if (!startPosition.value || !drawerContentRef.value) return;
    const isSupportsTouch = supportsTouchDetector();
    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;
    const moveToX = isSupportsTouch ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
    const moveToY = isSupportsTouch ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY;

    const { width, height } = drawerContentSize.value!;
    const [startX, startY] = startPosition.value!;
    // 计算鼠标移动距离是否超过 25%
    const changeStatusBoundary = (isHorizontal.value ? width : height) / 4;
    const diff = isHorizontal.value ? moveToX - startX : moveToY - startY;
    // 判断鼠标移动方向
    const isCorrectDirection = !((isPositiveDirection.value && diff < 0) || (!isPositiveDirection.value && diff > 0));
    // 可拖拽弹性距离
    const range = isNumber(props.breakBoundart)
        ? props.breakBoundart *
          (isHorizontal.value ? (isPositiveDirection.value ? -1 : 1) : isPositiveDirection.value ? -1 : 1)
        : 0;
    const changeStatus =
        (model.value ? isCorrectDirection : !isCorrectDirection) && Math.abs(diff) > changeStatusBoundary;

    changeVisible.value =
        changeStatus && ((model.value && isCorrectDirection) || (!model.value && !isCorrectDirection));
    // 改变 transform
    const translateVal = Math[isPositiveDirection.value ? 'max' : 'min'](diff, range);
    Object.assign(drawerContentRef.value.style, {
        transform: `translate3d(${isHorizontal.value ? translateVal : 0}px, ${
            !isHorizontal.value ? translateVal : 0
        }px, 0)`,
    });
};
const handleUp = () => {
    if (!startPosition.value || !drawerContentRef.value) return;
    drawerContentSize.value = undefined;
    startPosition.value = undefined;
    if (changeVisible.value) {
        model.value = !model.value;
        changeVisible.value = false;
    }

    Object.assign(drawerContentRef.value.style, {
        transition: `transform .3s linear`,
        transform: null,
    });
    setTimeout(() => {
        drawerContentRef.value &&
            Object.assign(drawerContentRef.value.style, {
                transition: null,
            });
    }, 300);

    document.removeEventListener(handledEvents.value.move, handleMove);
    document.removeEventListener(handledEvents.value.up, handleUp);
};

const handledEvents = ref<{ [key: string]: HTMLElementEventName }>({
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
});
const supportsTouchDetector = cacheFunction<boolean>(() => 'ontouchstart' in window);

onMounted(() => {
    handledEvents.value = supportsTouchDetector()
        ? { down: 'touchstart', move: 'touchmove', up: 'touchend' }
        : { down: 'mousedown', move: 'mousemove', up: 'mouseup' };

    if (props.modelValue) {
        visible.value = true;
    }
});
</script>

<template>
    <div
        :class="`drawer ${canSlide ? 'slide' : ''}`"
        @[handledEvents.down].stop="handleDown"
    >
        <Teleport
            to="body"
            :disabled="!fullscreen"
        >
            <Transition :name="slideName">
                <CdxOverlay
                    v-if="model"
                    :fullscreen="fullscreen"
                    @click="close"
                >
                    <div
                        ref="drawerContentRef"
                        :class="`drawer_content ${drawerContentClassName}`"
                        :style="drawerContentStyle"
                        v-on="bodySlideEvent"
                    >
                        <slot></slot>
                    </div>
                </CdxOverlay>
            </Transition>
        </Teleport>

        <div
            v-if="!fullscreen"
            ref="drawerSwipeRef"
            class="drawer_swipe"
        >
            <slot name="swipe"></slot>
        </div>
    </div>
</template>
