<script lang="ts" setup>
import { useBem, useSupportTouch, useTeleportContainer, useZIndex } from '@cdx-component/hooks';
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { resizeDraggerProps } from './resize-dragger';
import { Direction, RESIZE_INJECTION_KEY } from './constants';

defineOptions({ name: 'CdxDraggerResize' });
const props = defineProps(resizeDraggerProps);

const { contentRef } = inject(RESIZE_INJECTION_KEY)!;

let startDragData = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
const [, bem] = useBem('resize');
const { events, defineEventPosition } = useSupportTouch();
const { selector } = useTeleportContainer(bem.be('container'));
const { nextZIndex } = useZIndex();

const draggerRef = ref<HTMLElement>();
const draggerStyle = ref({
  zIndex: nextZIndex(),
});

const getBoundingPage = (el: HTMLElement, direction: string) => {
  const { scrollX, scrollY } = window;
  const rect = el.getBoundingClientRect();
  const top = rect.top + scrollY - props.size / 2;
  const left = rect.left + scrollX - props.size / 2;
  const bottom = rect.bottom + scrollY - props.size / 2;
  const right = rect.right + scrollX - props.size / 2;
  const width = rect.width + props.size;
  const height = rect.height + props.size;
  return {
    top: `${direction === 'bottom' ? bottom : top}px`,
    left: `${direction === 'right' ? right : left}px`,
    width: `${['left', 'right'].includes(direction) ? props.size : width}px`,
    height: `${['top', 'bottom'].includes(direction) ? props.size : height}px`,
  };
};
const updateDraggerPosition = () => {
  if (!contentRef.value) return;
  if (draggerRef.value) {
    draggerStyle.value = Object.assign(draggerStyle.value, getBoundingPage(contentRef.value, props.direction));
  }
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
  if (contentRef.value) {
    resizeObserver.observe(contentRef.value);
    resizeObserver.observe(document.body);
  }
});
onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>

<template>
  <Teleport :to="selector">
    <div
      ref="draggerRef"
      :class="[bem.be('dragger'), direction]"
      :style="draggerStyle"
      @[events.down]="(e:Event) => dragStart(e, direction)"
    />
  </Teleport>
</template>

<style lang="less" scoped></style>
