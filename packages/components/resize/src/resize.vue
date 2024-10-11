<script setup lang="ts">
import { CdxOnlyChild } from '@cdx-component/components';
import { useForwardRef } from '@cdx-component/hooks';
import { provide, ref } from 'vue';
import { RESIZE_INJECTION_KEY } from './constants';
import { resizeProps } from './resize';
import CdxResizeDragger from './resize-dragger.vue';

defineOptions({ name: 'CdxResize' });
defineProps(resizeProps);

const contentRef = ref<HTMLElement>();
useForwardRef(contentRef);

provide(RESIZE_INJECTION_KEY, {
  contentRef,
});
</script>

<template>
  <CdxOnlyChild>
    <slot />
  </CdxOnlyChild>
  <CdxResizeDragger
    v-for="direction in directions"
    :key="direction"
    :direction="direction"
    :size="size"
  />
</template>
