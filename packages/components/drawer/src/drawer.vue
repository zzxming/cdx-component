<script setup lang="ts">
import { computed, ref, onMounted, Teleport, type StyleValue, nextTick } from 'vue';
import { CdxOverlay } from '@cdx-component/components';
import { isNumber, cacheFunction } from '@cdx-component/utils';
import { drawerProps, drawerEmits } from './drawer';
import { useBem, useModelValue } from '@cdx-component/hooks';

type HTMLElementEventName = keyof HTMLElementEventMap;
defineOptions({ name: 'CdxDrawer' });
const props = defineProps(drawerProps);
const emits = defineEmits(drawerEmits);
const slots = defineSlots<{
    default(): any;
    swipe?(): any;
}>();

const [, bem] = useBem('drawer');
const { model } = useModelValue(props, false);

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
        // [`padding-${styleMap[props.direction]}`]: `${props.breakBoundart}px`,
        // [`margin-${styleMap[props.direction]}`]: `-${props.breakBoundart}px`,
        [styleMap.size]: isNumber(props.size) ? `${props.size}px` : props.size,
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

const changeVisible = ref(false);
const drawerContentSize = ref<DOMRect>();
const drawerSwipeRef = ref<HTMLElement>();
const drawerBodyRef = ref<HTMLElement>();
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
    if (!startPosition.value || !drawerBodyRef.value) return;
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
    Object.assign(drawerBodyRef.value.style, {
        transform: `translate3d(${isHorizontal.value ? translateVal : 0}px, ${
            !isHorizontal.value ? translateVal : 0
        }px, 0)`,
    });
};
const handleUp = async () => {
    await nextTick();
    document.removeEventListener(handledEvents.value.move, handleMove);
    document.removeEventListener(handledEvents.value.up, handleUp);

    if (!startPosition.value || !drawerBodyRef.value) return;

    drawerContentSize.value = undefined;
    startPosition.value = undefined;
    if (changeVisible.value) {
        model.value = !model.value;
        changeVisible.value = false;
    }

    Object.assign(drawerBodyRef.value.style, {
        transition: `transform .3s linear`,
        transform: null,
    });
    setTimeout(() => {
        drawerBodyRef.value &&
            Object.assign(drawerBodyRef.value.style, {
                transition: null,
            });
    }, 300);
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
});
</script>

<template>
    <div
        :class="[bem.b(), canSlide && bem.bm('slide')]"
        @[handledEvents.down].stop="handleDown"
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
                        v-on="bodySlideEvent"
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
