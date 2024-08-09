<script setup lang="ts">
import { useBem, useForwardRef, useSupportTouch, useTeleportContainer } from '@cdx-component/hooks';
import { ComponentPublicInstance, computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ensureArray } from '@cdx-component/utils';
import { CdxOnlyChild } from '@cdx-component/components';
import { Direction, resizeProps } from './resize';

defineOptions({ name: 'CdxResize' });

const props = defineProps(resizeProps);

const size = 8;

const [, bem] = useBem('resize');
const { events, defineEventPosition } = useSupportTouch();
const { selector } = useTeleportContainer(bem.be('container'));

const contentRef = ref<HTMLElement>();
useForwardRef(contentRef);

let startDragData = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
const leftDragger = ref<HTMLElement>();
const rightDragger = ref<HTMLElement>();
const topDragger = ref<HTMLElement>();
const bottomDragger = ref<HTMLElement>();
const draggerRefs = computed(() => ({
  top: topDragger.value,
  right: rightDragger.value,
  bottom: bottomDragger.value,
  left: leftDragger.value,
}));
const leftDraggerStyle = ref<Record<string, string>>({});
const rightDraggerStyle = ref<Record<string, string>>({});
const bottomDraggerStyle = ref<Record<string, string>>({});
const topDraggerStyle = ref<Record<string, string>>({});

const draggerStyleMap = computed(() => ({
  left: leftDraggerStyle.value,
  right: rightDraggerStyle.value,
  bottom: bottomDraggerStyle.value,
  top: topDraggerStyle.value,
}));
const dragDirections = computed<Direction[]>(() => props.directions ? ensureArray(props.directions) : []);

const getBoundingPage = (el: HTMLElement, direction: string) => {
  const { scrollX, scrollY } = window;
  const rect = el.getBoundingClientRect();
  const top = rect.top + scrollY - size / 2;
  const left = rect.left + scrollX - size / 2;
  const bottom = rect.bottom + scrollY - size / 2;
  const right = rect.right + scrollX - size / 2;
  const width = rect.width + size;
  const height = rect.height + size;
  return {
    top: `${direction === 'bottom' ? bottom : top}px`,
    left: `${direction === 'right' ? right : left}px`,
    width: `${['left', 'right'].includes(direction) ? size : width}px`,
    height: `${['top', 'bottom'].includes(direction) ? size : height}px`,
  };
};
const updateDraggerPosition = () => {
  if (!contentRef.value) return;
  for (const [direction, dragger] of Object.entries(draggerRefs.value)) {
    if (dragger) {
      Object.assign(dragger.style, getBoundingPage(contentRef.value, direction));
    }
  }
};
const bindDraggerRef = (el: ComponentPublicInstance | Element | null, direction: Direction) => {
  const draggerRefMap = {
    left: leftDragger,
    right: rightDragger,
    top: topDragger,
    bottom: bottomDragger,
  };
  draggerRefMap[direction].value = el as HTMLElement;
};
const dragStart = (e: Event, direction: Direction) => {
  if (!contentRef.value) return;
  const resizeXHandler = (e: Event) => {
    if (!contentRef.value) return;
    e.preventDefault();
    const { x } = defineEventPosition(e);
    const { x: startX, width } = startDragData;
    const newWidth = Math.max(0, x - startX + width);
    contentRef.value.style.width = `${newWidth}px`;
  };
  const resizeYHandler = (e: Event) => {
    if (!contentRef.value) return;
    e.preventDefault();
    const { y } = defineEventPosition(e);
    const { y: startY, height } = startDragData;
    const newHeight = Math.max(0, y - startY + height);
    contentRef.value.style.height = `${newHeight}px`;
  };
  const resizeEndHandler = () => {
    document.removeEventListener(events.value.move, resizeXHandler);
    document.removeEventListener(events.value.move, resizeYHandler);
    document.removeEventListener(events.value.up, resizeEndHandler);
  };
  e.preventDefault();
  const { x, y } = defineEventPosition(e);
  const { width, height } = window.getComputedStyle(contentRef.value);
  startDragData = { x, y, width: Number.parseFloat(width), height: Number.parseFloat(height) };
  document.addEventListener(events.value.move, ['top', 'bottom'].includes(direction) ? resizeYHandler : resizeXHandler);
  document.addEventListener(events.value.up, resizeEndHandler);
};

const resizeObserver = new ResizeObserver(updateDraggerPosition);
onMounted(() => {
  window.addEventListener('resize', updateDraggerPosition);
  if (contentRef.value) {
    resizeObserver.observe(contentRef.value);
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDraggerPosition);
  resizeObserver.disconnect();
});

watch(() => props.directions, () => {
  nextTick(updateDraggerPosition);
}, { immediate: true });
</script>

<template>
  <CdxOnlyChild>
    <slot />
  </CdxOnlyChild>
  <Teleport :to="selector">
    <div
      v-for="direction in dragDirections"
      :key="direction"
      :ref="(el) => bindDraggerRef(el, direction)"
      :class="[bem.be('dragger'), direction]"
      :style="draggerStyleMap[direction]"
      @[events.down]="(e:Event) => dragStart(e, direction)"
    />
  </Teleport>
</template>
