<script lang="ts" setup>
import { inject, nextTick, ref, watch } from 'vue';
import { useBem, useTeleportContainer, useZIndex } from '@cdx-component/hooks';
import { TOOLTIP_INJECTION_KEY } from './constants';
import { tooltipContentProps } from './tooltip-content';

defineOptions({ name: 'CdxTooltipContent' });
const props = defineProps(tooltipContentProps);

const distance = 4;
const [, bem] = useBem('tooltip');
const { nextZIndex } = useZIndex();
const { selector } = useTeleportContainer(bem.be('container'));

const { isVisiable, triggerRef, open, close } = inject(TOOLTIP_INJECTION_KEY)!;

const tooltipRef = ref<HTMLElement>();
const tooltipArrowRef = ref<HTMLElement>();

const tooltipPosition = ref({
  zIndex: String(nextZIndex()),
  top: '0px',
  left: '0px',
});
const tooltipArrowPosition = ref({
  top: '0px',
  left: '0px',
});

const isVisibleInWindow = ({ top, left, width, height }: {
  top: number;
  left: number;
  width: number;
  height: number;
}) => {
  const { innerWidth, innerHeight, scrollX, scrollY } = window;

  const isLeftWithinWindow = left > 0 && left + width < innerWidth + scrollX;
  const isTopWithinWindow = top > 0 && top + height < innerHeight + scrollY;

  return ['top', 'bottom'].includes(props.direction) ? isTopWithinWindow : isLeftWithinWindow;
};
const updateTooltipPosition = () => {
  if (!tooltipRef.value) return;

  const direction = props.direction;
  const arrowRect = tooltipArrowRef.value!.getBoundingClientRect();
  const elRect = triggerRef.value!.getBoundingClientRect();
  const contentRect = tooltipRef.value.getBoundingClientRect();

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

  if (!isVisibleInWindow({
    top: top + extra.top,
    left: left + extra.left,
    width: contentRect.width,
    height: contentRect.height,
  })) {
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
  // TODO?: limit tooltip in viewport. attention arrow position
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

const handleOpen = () => {
  open();
};
const handleClose = () => {
  close();
};
const handleTransitionAfterLeave = () => {
  tooltipPosition.value = {
    zIndex: tooltipPosition.value.zIndex,
    top: '0px',
    left: '0px',
  };
};

watch(() => [isVisiable.value, props.text], (val) => {
  val && nextTick(() => {
    updateTooltipPosition();
  });
}, { immediate: true });
</script>

<template>
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
        @mouseenter="handleOpen"
        @mouseleave="handleClose"
      >
        <slot />
        <div
          ref="tooltipArrowRef"
          :class="bem.be('arrow')"
          :style="tooltipArrowPosition"
        />
      </div>
    </Transition>
  </Teleport>
</template>
