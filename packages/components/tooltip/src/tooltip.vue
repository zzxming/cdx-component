<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import { useBem, useForwardRef, useTimeout, useZIndex } from '@cdx-component/hooks';
import { CdxOnlyChild } from '@cdx-component/components';
import { tooltipProps } from './tooltip';
import { useTooltipContainter } from './use-tooltip-container';

defineOptions({ name: 'CdxTooltip' });
const props = defineProps(tooltipProps);
const distance = 4;
const [, bem] = useBem('tooltip');
const { nextZIndex } = useZIndex();
const { selector } = useTooltipContainter();
const { startTimeout, clearTimeout } = useTimeout();

const triggerRef = ref<HTMLElement>();
const tooltipRef = ref<HTMLElement>();
const tooltipArrowRef = ref<HTMLElement>();
useForwardRef(triggerRef);

const tooltipPosition = ref({
  zIndex: String(nextZIndex()),
  top: '0px',
  left: '0px',
});
const tooltipArrowPosition = ref({
  top: '0px',
  left: '0px',
});
const isVisiable = ref(false);

const isVisibleInWindow = ({ top, left, width, height }: { top: number; left: number; width: number; height: number }) => {
  const { innerWidth, innerHeight, scrollX, scrollY } = window;

  const isLeftWithinWindow = left > 0 && left + width < innerWidth + scrollX;
  const isTopWithinWindow = top > 0 && top + height < innerHeight + scrollY;

  return isLeftWithinWindow && isTopWithinWindow;
};
const updateTooltipPosition = () => {
  if (!tooltipRef.value) return;
  const tooltipContent = tooltipRef.value;
  const arrow = tooltipArrowRef.value!;

  const direction = props.directive;
  const arrowRect = arrow.getBoundingClientRect();
  const elRect = triggerRef.value!.getBoundingClientRect();
  const contentRect = tooltipContent.getBoundingClientRect();

  let top = window.scrollY + elRect.top;
  let left = window.scrollX + elRect.left;

  const extraPositionMap = {
    top: {
      top: -contentRect.height - arrowRect.height - distance,
      left: elRect.width / 2 - contentRect.width / 2,
      arrow: {
        top: contentRect.height - arrowRect.height / 2,
        left: contentRect.width / 2 - arrowRect.width / 2,
      },
    },
    right: {
      top: elRect.height / 2 - contentRect.height / 2,
      left: elRect.width + arrowRect.width / 2 + distance,
      arrow: {
        top: contentRect.height / 2 - arrowRect.height / 2,
        left: -arrowRect.width / 2,
      },
    },
    bottom: {
      top: contentRect.height + arrowRect.height + distance,
      left: elRect.width / 2 - contentRect.width / 2,
      arrow: {
        top: -arrowRect.height / 2,
        left: contentRect.width / 2 - arrowRect.width / 2,
      },
    },
    left: {
      top: elRect.height / 2 - contentRect.height / 2,
      left: -contentRect.width - arrowRect.width / 2 - distance,
      arrow: {
        top: contentRect.height / 2 - arrowRect.height / 2,
        left: contentRect.width - arrowRect.width / 2,
      },
    },
  } as const;
  let extra = extraPositionMap[direction];

  if (!isVisibleInWindow({ top: top + extra.top, left: left + extra.left, width: contentRect.width, height: contentRect.height })) {
    const reverseDirection = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    } as const;
    extra = extraPositionMap[reverseDirection[direction]];
  }
  top += extra.top;
  left += extra.left;
  tooltipPosition.value = {
    zIndex: String(nextZIndex()),
    top: `${top}px`,
    left: `${left}px`,
  };
  tooltipArrowPosition.value = {
    top: `${extra.arrow.top}px`,
    left: `${extra.arrow.left}px`,
  };
};

const handleMouseEnter = () => {
  clearTimeout();
  isVisiable.value = true;
  nextTick(() => {
    updateTooltipPosition();
  });
};
const handleMouseLeave = () => {
  clearTimeout();
  startTimeout(() => {
    isVisiable.value = false;
  }, props.hideDelay);
};
const handleTransitionAfterLeave = () => {
  tooltipPosition.value = {
    zIndex: tooltipPosition.value.zIndex,
    top: '0px',
    left: '0px',
  };
};
</script>

<template>
  <CdxOnlyChild
    ref="triggerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot />
  </CdxOnlyChild>
  <Teleport :to="selector">
    <Transition
      :name="bem.ns('fade')"
      appear
      @after-leave="handleTransitionAfterLeave"
    >
      <div
        v-if="isVisiable"
        ref="tooltipRef"
        :class="bem.b()"
        :style="tooltipPosition"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <slot name="content">
          <span>{{ text }}</span>
        </slot>
        <div
          ref="tooltipArrowRef"
          :class="bem.be('arrow')"
          :style="tooltipArrowPosition"
        />
      </div>
    </Transition>
  </Teleport>
</template>
