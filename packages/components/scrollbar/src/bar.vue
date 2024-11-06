<!-- eslint-disable unicorn/prefer-add-event-listener -->
<script lang="ts" setup>
import { useBem } from '@cdx-component/hooks';
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { barProps } from './bar';
import { scrollbarContextKey, scrollbarGap } from './constants';

defineOptions({ name: 'CdxBar' });
const props = defineProps(barProps);

const scrollbarContext = inject(scrollbarContextKey)!;

let thumbClickPosition = 0;
let dragging = false;
let cursorLeave = false;
let originDocumentOnselectstart = document.onselectstart;

const [, bem] = useBem('scrollbar');
const barRef = ref<HTMLElement | null>(null);
const thumbRef = ref<HTMLElement | null>(null);
const offset = ref(0);
const visible = ref(false);

const directionClass = computed(() => {
  return props.isVertical ? bem.is('vertical', props.isVertical) : bem.is('horizontal', !props.isVertical);
});
const propertyMap = computed(() => {
  return props.isVertical
    ? {
        size: 'height',
        offset: 'offsetHeight',
        scrollDirection: 'scrollTop',
        scrollSize: 'scrollHeight',
        axis: 'Y',
        direction: 'top',
        client: 'clientY',
      } as const
    : {
        size: 'width',
        offset: 'offsetWidth',
        scrollDirection: 'scrollLeft',
        scrollSize: 'scrollWidth',
        axis: 'X',
        direction: 'left',
        client: 'clientX',
      } as const;
});
const thumbStyle = computed(() => {
  return {
    [propertyMap.value.size]: props.size,
    transform: `translate${propertyMap.value.axis}(${offset.value}%)`,
  };
});
const offsetRatio = computed(() =>
  barRef.value![propertyMap.value.offset] ** 2
  / scrollbarContext.wrapperRef.value![propertyMap.value.scrollSize]
  / props.ratio
  / thumbRef.value![propertyMap.value.offset],
);

const updateScrollbar = (wrapper: HTMLElement) => {
  offset.value = (
    (wrapper[propertyMap.value.scrollDirection] * 100)
    / (wrapper[propertyMap.value.offset] - scrollbarGap)
  ) * props.ratio;
};
const resetDocumentOnselectstart = () => {
  if (originDocumentOnselectstart) {
    document.onselectstart = originDocumentOnselectstart;
  }
};
const mouseMoveDocumentHandler = (e: MouseEvent) => {
  if (dragging === false) return;
  if (!thumbClickPosition) return;

  const offset = (barRef.value!.getBoundingClientRect()[propertyMap.value.direction] - e[propertyMap.value.client]) * -1;
  const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 * offsetRatio.value) / barRef.value![propertyMap.value.offset];
  scrollbarContext.wrapperRef.value![propertyMap.value.scrollDirection] = (thumbPositionPercentage * scrollbarContext.wrapperRef.value![propertyMap.value.scrollSize]) / 100;
};

const mouseUpDocumentHandler = () => {
  thumbClickPosition = 0;
  dragging = false;
  document.removeEventListener('mousemove', mouseMoveDocumentHandler);
  document.removeEventListener('mouseup', mouseUpDocumentHandler);
  resetDocumentOnselectstart();
  if (cursorLeave) {
    visible.value = false;
  }
};
const startDrag = (e: MouseEvent) => {
  e.stopImmediatePropagation();
  dragging = true;
  document.addEventListener('mousemove', mouseMoveDocumentHandler);
  document.addEventListener('mouseup', mouseUpDocumentHandler);
  originDocumentOnselectstart = document.onselectstart;
  document.onselectstart = () => false;
};
const handleThumbMousedown = (e: MouseEvent) => {
  e.stopPropagation();
  if (e.ctrlKey || [1, 2].includes(e.button)) return;

  window.getSelection()?.removeAllRanges();
  startDrag(e);

  const el = e.currentTarget as HTMLElement;
  if (!el) return;
  const elRect = el.getBoundingClientRect();
  thumbClickPosition = props.isVertical ? e.clientY - elRect.top : e.clientX - elRect.left;
};
const wrapperEnter = () => {
  cursorLeave = false;
  // eslint-disable-next-line unicorn/explicit-length-check
  visible.value = !!props.size;
};
const wrapperLeave = () => {
  cursorLeave = true;
  visible.value = dragging;
};

onMounted(() => {
  scrollbarContext.scrollbarRef.value!.addEventListener('mouseenter', wrapperEnter);
  scrollbarContext.scrollbarRef.value!.addEventListener('mouseleave', wrapperLeave);
});
onBeforeUnmount(() => {
  scrollbarContext.scrollbarRef.value!.removeEventListener('mouseenter', wrapperEnter);
  scrollbarContext.scrollbarRef.value!.removeEventListener('mouseleave', wrapperLeave);
  resetDocumentOnselectstart();
});

defineExpose({
  updateScrollbar,
});
</script>

<template>
  <Transition :name="bem.ns('fade')">
    <div
      v-show="visible"
      ref="barRef"
      :class="[bem.be('bar'), directionClass]"
    >
      <div
        ref="thumbRef"
        :class="[bem.be('thumb'), directionClass]"
        :style="thumbStyle"
        @mousedown="handleThumbMousedown"
      />
    </div>
  </Transition>
</template>
