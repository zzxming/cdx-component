<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBem } from '@cdx-component/hooks';
import { isFunction, isUndefined, cacheFunction } from '@cdx-component/utils';
import { CdxLoading } from '@cdx-component/components';
import { captchaSliderProps, captchaSliderEmits } from './captcha-slider';

const isSupportTouch = cacheFunction(() => 'ontouchstart' in window);
const handledEvents = isSupportTouch()
    ? { down: 'touchstart', move: 'touchmove', up: 'touchend' }
    : { down: 'mousedown', move: 'mousemove', up: 'mouseup' };

const props = defineProps(captchaSliderProps);
const emits = defineEmits(captchaSliderEmits);

const [_, bem] = useBem('captcha-slider');

let trackWidth = 1;
const trackRef = ref<HTMLDivElement>();
const startX = ref(0);
const moveX = ref(0);
const isSuccess = ref(false);
const dragging = ref(false);
const resetting = ref(false);
const matchLoading = ref(false);

const isLoading = computed(() => props.loading || matchLoading.value);
const isLock = computed(() => props.lock || isLoading.value || isSuccess.value);
const currentX = computed(() => {
    const pre = (moveX.value - startX.value) / trackWidth;
    return Math.max(Math.min(pre, 1), 0) * 100;
});
const fillStyle = computed(() => ({
    [bem.cv('captcha-slider-bg-transition')]: resetting.value ? 'width 300ms ease' : undefined,
    width: `${currentX.value}%`,
}));
const tipStyle = computed(() => ({
    [bem.cv('captcha-slider-tip-transition')]: resetting.value ? 'background-position-x 300ms ease' : undefined,
    backgroundPositionX: `${-currentX.value}%`,
}));
const innerStyle = computed(() => ({
    [bem.cv('captcha-slider-trigger-transition')]: resetting.value ? 'width 300ms ease' : undefined,
    width: `${currentX.value}%`,
}));

const verifyMatch = () => {
    const nleft = currentX.value - props.tolerance;
    const nright = currentX.value + props.tolerance;
    return nleft <= props.target && nright >= props.target;
};
const handleDown = (e: Event) => {
    if (resetting.value || isLock.value || isLoading.value) return;
    const isSupportsTouch = isSupportTouch();
    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;
    startX.value = isSupportsTouch ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
    trackWidth = trackRef.value!.getBoundingClientRect().width;

    document.addEventListener(handledEvents.move, handleMove);
    document.addEventListener(handledEvents.up, handleUp);

    dragging.value = true;
};
const handleMove = (e: Event) => {
    if (resetting.value || isSuccess.value) return;
    const isSupportsTouch = isSupportTouch();
    const touchEvent = e as TouchEvent;
    const mouseEvent = e as MouseEvent;

    moveX.value = isSupportsTouch ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
    emits('move', currentX.value);
};
const handleUp = async () => {
    if (resetting.value || isSuccess.value) return;
    document.removeEventListener(handledEvents.move, handleMove);
    document.removeEventListener(handledEvents.up, handleUp);

    matchLoading.value = true;
    let beforeMatched;
    if (isFunction(props.onBeforeSuccess)) {
        beforeMatched = await props.onBeforeSuccess();
    }

    const matched = verifyMatch();
    if (matched && (isUndefined(beforeMatched) || beforeMatched)) {
        isSuccess.value = true;
        matchLoading.value = false;
        emits('success');
    } else {
        emits('fail');
        reset();
    }
    dragging.value = false;
};
const reset = () => {
    if (moveX.value !== 0) {
        resetting.value = true;
        moveX.value = 0;
    }
    isSuccess.value = false;
    matchLoading.value = false;
};
const afterReset = () => {
    resetting.value = false;
};

defineExpose({
    trackRef,
    currentX,
    resetting,
    reset,
});
</script>

<template>
    <div :class="[bem.b()]">
        <div
            :class="bem.be('bg')"
            :style="fillStyle"
        ></div>
        <div
            :class="bem.be('tip')"
            :style="tipStyle"
        >
            <slot
                name="tip"
                :isSuccess="isSuccess"
            >
                {{ isSuccess ? '验证成功' : '滑动滑块' }}
            </slot>
        </div>
        <div
            ref="trackRef"
            :class="bem.be('track')"
        >
            <div
                :class="bem.be('inner')"
                :style="innerStyle"
                @transitionend="afterReset"
            >
                <div
                    :class="[bem.be('trigger'), (isLock || isLoading) && bem.bem('trigger', 'lock')]"
                    @[handledEvents.down]="handleDown"
                >
                    <slot name="trigger">
                        <CdxLoading
                            v-if="isLoading"
                            :visible="true"
                        />
                        <span v-else>-></span>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
