<script setup lang="ts">
import type { BarInstance } from './bar';
import { useBem } from '@cdx-component/hooks';
import { nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref } from 'vue';
import Bar from './bar.vue';
import { scrollbarContextKey, scrollbarGap } from './constants';
import { scrollbarProps } from './scrollbar';

defineOptions({ name: 'CdxScrollbar' });
const props = defineProps(scrollbarProps);

const [, bem] = useBem('scrollbar');

const scrollbarRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
const barXRef = ref<BarInstance>();
const barYRef = ref<BarInstance>();
const thumbSizeWidth = ref('');
const thumbSizeHeight = ref('');
const ratioX = ref(1);
const ratioY = ref(1);

const handleScroll = () => {
  if (wrapperRef.value) {
    barXRef.value?.updateScrollbar(wrapperRef.value);
    barYRef.value?.updateScrollbar(wrapperRef.value);
  }
};
const update = () => {
  if (!wrapperRef.value) return;
  const offsetHeight = wrapperRef.value.offsetHeight - scrollbarGap;
  const offsetWidth = wrapperRef.value.offsetWidth - scrollbarGap;

  const originalHeight = offsetHeight ** 2 / wrapperRef.value.scrollHeight;
  const originalWidth = offsetWidth ** 2 / wrapperRef.value.scrollWidth;
  const height = Math.max(originalHeight, props.minSize);
  const width = Math.max(originalWidth, props.minSize);

  ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
  ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));

  thumbSizeHeight.value = height + scrollbarGap < offsetHeight ? `${height}px` : '';
  thumbSizeWidth.value = width + scrollbarGap < offsetWidth ? `${width}px` : '';
};

let observer: ResizeObserver | undefined;
onMounted(() => {
  if (wrapperRef.value) {
    observer = new ResizeObserver(update);
    observer.observe(wrapperRef.value);
  }
  nextTick(() => {
    update();
  });
});
onUpdated(() => update());
onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});

provide(scrollbarContextKey, {
  scrollbarRef,
  wrapperRef,
});
</script>

<template>
  <div
    ref="scrollbarRef"
    :class="bem.b()"
  >
    <div
      ref="wrapperRef"
      :class="bem.be('wrapper')"
      @scroll="handleScroll"
    >
      <slot />
    </div>
    <Bar
      ref="barYRef"
      :size="thumbSizeHeight"
      :ratio="ratioY"
      :is-vertical="true"
    />
    <Bar
      ref="barXRef"
      :size="thumbSizeWidth"
      :ratio="ratioX"
      :is-vertical="false"
    />
  </div>
</template>
