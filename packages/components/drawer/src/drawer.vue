<script setup lang="ts">
import { computed, ref, Teleport, type StyleValue, nextTick } from 'vue';
import { CdxOverlay } from '@cdx-component/components';
import { isNumber } from '@cdx-component/utils';
import { drawerProps, drawerEmits } from './drawer';
import { useBem, useModelValue, useSupportTouch } from '@cdx-component/hooks';
import { namespace } from '@cdx-component/constants';

defineOptions({ name: 'CdxDrawer' });
const props = defineProps(drawerProps);
const emits = defineEmits(drawerEmits);
const slots = defineSlots<{
    default(): any;
    swipe?(): any;
}>();

const [, bem] = useBem('drawer');
const { model } = useModelValue(props, false);

let isOpening = false;
let bodySize = 0;
const drawerContentRect = ref<DOMRect>();
const drawerSwipeRef = ref<HTMLElement>();
const drawerBodyRef = ref<HTMLElement>();
const startPosition = ref<[number, number]>();
const { isSupportTouch, events: handledEvents } = useSupportTouch();
const drawerBodyTransform = ref<string>();
const drawerBodyTransition = ref(false);

const canSlide = computed(() => !props.fullscreen && slots.swipe && props.slide);
const isHorizontal = computed(() => ['left', 'right'].includes(props.direction));
const isPositiveDirection = computed(() => ['left', 'top'].includes(props.direction));
const breakBoundary = computed(() => (isNumber(props.breakBoundary) ? props.breakBoundary : 0));
const bodySlideStopEvent = computed(() => {
    const events = {} as { [key in keyof HTMLElementEventMap]: Function };
    if (!props.bodySlide) {
        const stopFunc = (e: Event) => e.stopPropagation();
        const stopEvent = [handledEvents.value.down];
        for (const key of stopEvent) {
            events[key] = stopFunc;
        }
    }
    return events;
});
const drawerBodyStyle = computed<StyleValue>(() => {
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
        [styleMap.size]: isNumber(props.size) ? `${props.size}px` : props.size,
        transform: drawerBodyTransform.value,
        transition: !drawerBodyTransition.value
            ? undefined
            : `transform var(--${namespace}-transition-duration) linear`,
    };
});
const drawerBodyClassName = computed(() => {
    const className = {
        right: 'ltr',
        left: 'rtl',
        top: 'btt',
        bottom: 'ttb',
    };
    return `${className[props.direction]}`;
});

const close = () => {
    if (!props.clickModelCose) return;
    model.value = false;
};
const handleDown = (e: Event) => {
    if (!canSlide.value) return;
    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;
    drawerContentRect.value = drawerSwipeRef.value!.getBoundingClientRect();
    startPosition.value = [
        isSupportTouch.value ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX,
        isSupportTouch.value ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY,
    ];

    drawerBodyTransition.value = false;
    isOpening = !model.value;
    document.addEventListener(handledEvents.value.move, handleMove, { passive: false });
    document.addEventListener(handledEvents.value.up, handleUp, { passive: false });
};
const handleMove = async (e: Event) => {
    if (!startPosition.value || !drawerBodyRef.value) return;
    e.preventDefault();
    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;
    const moveToX = isSupportTouch.value ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
    const moveToY = isSupportTouch.value ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY;

    const [startX, startY] = startPosition.value!;
    const diff = isHorizontal.value ? moveToX - startX : moveToY - startY;

    // 判断鼠标移动方向
    const isCorrectDirection = (isPositiveDirection.value && diff > 0) || (!isPositiveDirection.value && diff < 0);
    if (!model.value && isCorrectDirection) return;

    model.value = true;
    await nextTick();
    if (!bodySize) {
        bodySize = parseFloat(getComputedStyle(drawerBodyRef.value)[isHorizontal.value ? 'width' : 'height']);
    }

    // 可拖拽弹性距离
    const range = breakBoundary.value * (isPositiveDirection.value ? -1 : 1);
    // 位移距离
    const translateVal = Math[isPositiveDirection.value ? 'max' : 'min'](
        diff,
        (isPositiveDirection.value ? -1 : 1) * (isOpening ? bodySize : 0) + range
    );
    const positivePosition = isPositiveDirection.value ? '' : '-';
    const x = isHorizontal.value ? translateVal : 0;
    const y = !isHorizontal.value ? translateVal : 0;
    const translateX = isOpening && isHorizontal.value ? `calc(${positivePosition}100% + ${x}px)` : `${x}px`;
    const translateY = isOpening && !isHorizontal.value ? `calc(${positivePosition}100% + ${y}px)` : `${y}px`;
    drawerBodyTransform.value = `translate3d(${translateX}, ${translateY}, 0)`;
};
const handleUp = async (e: Event) => {
    await nextTick();
    document.removeEventListener(handledEvents.value.move, handleMove);
    document.removeEventListener(handledEvents.value.up, handleUp);
    if (!startPosition.value || !drawerBodyRef.value) return;
    e.preventDefault();
    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;
    const moveToX = isSupportTouch.value ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
    const moveToY = isSupportTouch.value ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY;

    const { width, height } = drawerContentRect.value!;
    const [startX, startY] = startPosition.value!;

    // 计算鼠标移动距离是否超过 25%
    const changeStatusBoundary = (isHorizontal.value ? width : height) / 4;
    const diff = isHorizontal.value ? moveToX - startX : moveToY - startY;
    if (isOpening ? Math.abs(diff) < changeStatusBoundary : Math.abs(diff) > changeStatusBoundary) {
        model.value = !model.value;
    }
    bodySize = 0;
    drawerContentRect.value = undefined;
    startPosition.value = undefined;

    drawerBodyTransition.value = true;
    drawerBodyTransform.value = undefined;
};
const handleTransitionEnd = () => {
    drawerBodyTransition.value = false;
};
</script>

<template>
    <div
        :class="[bem.b(), canSlide && bem.bm('slide')]"
        @[handledEvents.down].prevent.stop="handleDown"
    >
        <div
            v-if="!fullscreen"
            ref="drawerSwipeRef"
            :class="bem.be('swipe')"
        >
            <slot name="swipe"></slot>
        </div>
        <Teleport
            to="body"
            :disabled="!fullscreen"
        >
            <Transition :name="bem.ns('fade')">
                <CdxOverlay
                    v-model="model"
                    :fullscreen="fullscreen"
                    @click="close"
                >
                    <div
                        ref="drawerBodyRef"
                        :class="[bem.be('body'), drawerBodyClassName]"
                        :style="drawerBodyStyle"
                        :direction="direction"
                        v-on="bodySlideStopEvent"
                        @transitionend="handleTransitionEnd"
                    >
                        <div :class="bem.be('content')">
                            <slot></slot>
                        </div>
                    </div>
                </CdxOverlay>
            </Transition>
        </Teleport>
    </div>
</template>
