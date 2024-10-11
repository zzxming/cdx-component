<script setup lang="ts">
import { CdxOverlay } from '@cdx-component/components';
import { namespace } from '@cdx-component/constants';
import { useBem, useModelValue, useSlide, useSupportTouch } from '@cdx-component/hooks';
import { isNumber } from '@cdx-component/utils';
import { computed, nextTick, ref, type StyleValue } from 'vue';
import { drawerEmits, drawerProps } from './drawer';

defineOptions({ name: 'CdxDrawer' });
const props = defineProps(drawerProps);
defineEmits(drawerEmits);
const slots = defineSlots<{
  default: () => any;
  swipe?: () => any;
}>();

const [, bem] = useBem('drawer');
const { model } = useModelValue(props, false);
const { events: handledEvents } = useSupportTouch();

let isOpening = false;
let bodySize = 0;
const drawerContentRect = ref<DOMRect>();
const drawerSwipeRef = ref<HTMLElement>();
const drawerBodyRef = ref<HTMLElement>();
const drawerBodyTransform = ref<string>();
const drawerBodyTransition = ref(false);
const slidRef = ref<HTMLElement>();

const canSlide = computed(() => !props.fullscreen && slots.swipe && props.slide);
const isHorizontal = computed(() => ['left', 'right'].includes(props.direction));
const isPositiveDirection = computed(() => ['left', 'top'].includes(props.direction));
const breakBoundary = computed(() => (isNumber(props.breakBoundary) ? props.breakBoundary : 0));
const bodySlideStopEvent = computed(() => {
  const events: Record<string, Function> = {};
  if (!props.bodySlide) {
    const stopFunc = (e: Event) => e.stopPropagation();
    const stopEvent = [handledEvents.value.down];
    for (const key of stopEvent) {
      events[key] = stopFunc;
    }
  }
  return events;
});
const drawerBodyStyle = computed<StyleValue>(() => ({
  position: props.fullscreen ? 'fixed' : 'absolute',
  [props.direction]: 'auto',
  [isHorizontal.value ? 'width' : 'height']: isNumber(props.size) ? `${props.size}px` : props.size,
  transform: drawerBodyTransform.value,
  transition: !drawerBodyTransition.value
    ? undefined
    : `transform var(--${namespace}-transition-duration) linear`,
}));
const drawerBodyClassName = computed(() => {
  const className = {
    right: 'ltr',
    left: 'rtl',
    top: 'btt',
    bottom: 'ttb',
  };
  return `${className[props.direction]}`;
});

const { direction: slideDirection } = useSlide(slidRef, {
  start: () => {
    if (!canSlide.value) return;
    drawerContentRect.value = drawerSwipeRef.value!.getBoundingClientRect();

    drawerBodyTransition.value = false;
    isOpening = !model.value;
  },
  move: async (_, { diffX, diffY }) => {
    if (!canSlide.value || !drawerBodyRef.value) return;

    const diff = isHorizontal.value ? diffX : diffY;
    // 判断鼠标移动方向
    if (
      (isOpening && ((isPositiveDirection.value && diff < 0) || (!isPositiveDirection.value && diff > 0)))
      || (
        !isOpening
        && ((isPositiveDirection.value && diff > -1 * props.breakBoundary) || (!isPositiveDirection.value && diff < props.breakBoundary))
      )
    ) {
      model.value = true;
      await nextTick();
      if (!bodySize) {
        bodySize = Number.parseFloat(getComputedStyle(drawerBodyRef.value)[isHorizontal.value ? 'width' : 'height']);
      }
      // 可拖拽弹性距离
      const range = breakBoundary.value * (isPositiveDirection.value ? -1 : 1);
      // 位移距离
      const translateVal = Math[isPositiveDirection.value ? 'max' : 'min'](
        diff,
        (isPositiveDirection.value ? -1 : 1) * (isOpening ? bodySize : 0) + range,
      );
      const positivePosition = isPositiveDirection.value ? '' : '-';
      const x = isHorizontal.value ? translateVal : 0;
      const y = !isHorizontal.value ? translateVal : 0;
      const translateX = isOpening && isHorizontal.value ? `calc(${positivePosition}100% + ${x}px)` : `${x}px`;
      const translateY = isOpening && !isHorizontal.value ? `calc(${positivePosition}100% + ${y}px)` : `${y}px`;
      drawerBodyTransform.value = `translate3d(${translateX}, ${translateY}, 0)`;
    }
  },
  end: async (_, { diffX, diffY }) => {
    if (!canSlide.value || !drawerBodyRef.value) return;
    const { width, height } = drawerContentRect.value!;

    // 计算鼠标移动距离是否超过 25%
    const changeStatusBoundary = (isHorizontal.value ? width : height) / 4;
    const diff = isHorizontal.value ? diffX : diffY;

    let i = -1;
    if (isHorizontal.value) {
      i = isPositiveDirection.value ? (isOpening ? 3 : 1) : isOpening ? 1 : 3;
    }
    else {
      i = isPositiveDirection.value ? (isOpening ? 0 : 2) : isOpening ? 2 : 0;
    }
    if (slideDirection.value[i]) {
      if (!isOpening && Math.abs(diff) > changeStatusBoundary) {
        model.value = !model.value;
      }
      else if (isOpening && Math.abs(diff) < changeStatusBoundary) {
        model.value = !model.value;
      }
    }

    bodySize = 0;
    drawerContentRect.value = undefined;
    drawerBodyTransition.value = true;
    drawerBodyTransform.value = undefined;
  },
});

const close = () => {
  if (!props.clickMaskClose) return;
  model.value = false;
};
const handleTransitionEnd = () => {
  drawerBodyTransition.value = false;
};
</script>

<template>
  <div
    ref="slidRef"
    :class="[bem.b(), canSlide && bem.bm('slide')]"
  >
    <div
      v-if="!fullscreen"
      ref="drawerSwipeRef"
      :class="bem.be('swipe')"
    >
      <slot name="swipe" />
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
              <slot />
            </div>
          </div>
        </CdxOverlay>
      </Transition>
    </Teleport>
  </div>
</template>
