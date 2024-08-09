<script lang="ts" setup>
import { provide, ref } from 'vue';
import { useForwardRef, useTimeout } from '@cdx-component/hooks';
import { CdxOnlyChild } from '@cdx-component/components';
import CdxTooltipContent from './tooltip-content.vue';
import { tooltipProps } from './tooltip';
import { TOOLTIP_INJECTION_KEY } from './constants';

defineOptions({ name: 'CdxTooltip' });
const props = defineProps(tooltipProps);
const { startTimeout, clearTimeout } = useTimeout();

const triggerRef = ref<HTMLElement>();
useForwardRef(triggerRef);

const isVisiable = ref(false);

const open = () => {
  clearTimeout();
  isVisiable.value = true;
};
const close = () => {
  clearTimeout();
  startTimeout(() => {
    isVisiable.value = false;
  }, props.hideDelay);
};

provide(TOOLTIP_INJECTION_KEY, {
  isVisiable,
  triggerRef,
  open,
  close,
});
</script>

<template>
  <CdxOnlyChild
    @mouseenter="open"
    @mouseleave="close"
  >
    <slot />
  </CdxOnlyChild>
  <CdxTooltipContent :direction="direction" :text="text">
    <slot name="content">
      <span>{{ text }}</span>
    </slot>
  </CdxTooltipContent>
</template>
