<script setup lang="ts">
import type { StyleValue } from 'vue';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { useBem, useSupportTouch, useTeleportContainer, useZIndex } from '@cdx-component/hooks';
import { HEXtoRGB, HSBtoHEX, HSBtoRGB, RGBtoHEX, RGBtoHSB, validateHSB } from '@cdx-component/utils';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { colorPickerEmits, colorPickerProps } from './color-picker';

defineOptions({ name: 'CdxColorPicker' });
const props = defineProps(colorPickerProps);
const emits = defineEmits(colorPickerEmits);

const [, bem] = useBem('color-picker');
const { events, defineEventPosition } = useSupportTouch();
const { nextZIndex } = useZIndex();
const { selector } = useTeleportContainer(bem.be('container'));

let internalChange = true;

const contentRef = ref<HTMLElement>();
const previewRef = ref<HTMLElement>();
const selectorRef = ref<HTMLElement>();
const hueRef = ref<HTMLElement>();
const hueDragging = ref(false);
const colorDragging = ref(false);
const hsbValue = ref(RGBtoHSB(HEXtoRGB(props.modelValue || '#ff0000')));
const contentVisible = ref(false);

const backgroundHandleStyle = computed<StyleValue>(() => ({
  left: `${Math.floor((150 * hsbValue.value.s) / 100)}px`,
  top: `${Math.floor((150 * (100 - hsbValue.value.b)) / 100)}px`,
}));
const hueHandleStyle = computed<StyleValue>(() => ({
  top: `${Math.floor(150 - (150 * hsbValue.value.h) / 360)}px`,
}));
const previewStyle = computed<StyleValue>(() => ({
  backgroundColor: `#${HSBtoHEX(hsbValue.value)}`,
}));
const rootStyle = computed<StyleValue>(() => ({
  display: props.selectOnly ? 'block' : undefined,
}));
const contentStyle = computed<StyleValue>(() => ({
  position: props.selectOnly ? 'static' : undefined,
}));

const updateSelectorStyle = () => {
  if (!selectorRef.value) return;
  selectorRef.value.style.backgroundColor = `#${RGBtoHEX(HSBtoRGB({
    h: hsbValue.value.h,
    s: 100,
    b: 100,
  }))}`;
};
const pickColor = (event: Event) => {
  if (!selectorRef.value) return;
  event.preventDefault();
  const { pageX, pageY } = defineEventPosition(event);
  const rect = selectorRef.value.getBoundingClientRect();
  const top = rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
  const left = rect.left + document.body.scrollLeft;
  const saturation = Math.floor((100 * Math.max(0, Math.min(150, pageX - left))) / 150);
  const brightness = Math.floor((100 * (150 - Math.max(0, Math.min(150, pageY - top)))) / 150);

  internalChange = true;
  hsbValue.value = validateHSB({
    h: hsbValue.value.h,
    s: saturation,
    b: brightness,
  });

  emits('change', HSBtoHEX(hsbValue.value));
};
const pickHue = (event: Event) => {
  if (!hueRef.value) return;
  event.preventDefault();
  const { pageY } = defineEventPosition(event);
  const top = hueRef.value.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);

  internalChange = true;
  hsbValue.value = validateHSB({
    h: Math.floor((360 * (150 - Math.max(0, Math.min(150, pageY - top)))) / 150),
    s: hsbValue.value.s,
    b: hsbValue.value.b,
  });

  updateSelectorStyle();
};
const onDrag = (event: Event) => {
  if (colorDragging.value) {
    pickColor(event);
    event.preventDefault();
  }

  if (hueDragging.value) {
    pickHue(event);
    event.preventDefault();
  }
};
const onColorSelectorDragEnd = () => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', onColorSelectorDragEnd);
  colorDragging.value = false;
};
const onColorSelectorMousedown = (e: Event) => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', onColorSelectorDragEnd);
  colorDragging.value = true;
  pickColor(e);
};
const onColorHueDragEnd = () => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', onColorHueDragEnd);
  hueDragging.value = false;
};
const onColorHueMousedown = (event: MouseEvent) => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', onColorHueDragEnd);
  hueDragging.value = true;
  pickHue(event);
};
const updateContentPosition = async () => {
  await nextTick();
  if (!contentRef.value || !previewRef.value) return;
  updateSelectorStyle();

  const elementDimensions = { width: contentRef.value.offsetWidth, height: contentRef.value.offsetHeight };
  const targetDimensions = { width: previewRef.value.offsetWidth, height: previewRef.value.offsetHeight };
  const targetOffset = previewRef.value.getBoundingClientRect();
  const { scrollY, scrollX } = window;
  let top;

  if (targetOffset.top + targetDimensions.height + elementDimensions.height > window.innerHeight) {
    top = targetOffset.top + scrollY - elementDimensions.height;
    if (top < 0) {
      top = scrollY;
    }
  }
  else {
    top = targetDimensions.height + targetOffset.top + scrollY;
  }

  const left = targetOffset.left + elementDimensions.width > window.innerWidth ? Math.max(0, targetOffset.left + scrollX + targetDimensions.width - elementDimensions.width) : targetOffset.left + scrollX;
  contentRef.value.style.top = `${top}px`;
  contentRef.value.style.left = `${left}px`;

  Object.assign(contentRef.value.style, {
    zIndex: nextZIndex(),
  });
};
const closePreview = () => {
  contentVisible.value = false;
};
const onPreviewClick = () => {
  contentVisible.value = !contentVisible.value;
  document.removeEventListener('click', closePreview);
  if (contentVisible.value) {
    updateContentPosition();
    document.addEventListener('click', closePreview, { once: true });
  }
};

onMounted(() => {
  updateSelectorStyle();
});
onBeforeUnmount(() => {
  document.removeEventListener('click', closePreview);
});

watch(hsbValue, () => {
  if (internalChange) {
    internalChange = false;
    emits(UPDATE_MODEL_EVENT, `#${HSBtoHEX(hsbValue.value)}`);
  }
}, { immediate: true });
</script>

<template>
  <div :class="bem.b()" :style="rootStyle">
    <div v-if="!selectOnly" ref="previewRef" :class="bem.be('preview')" :style="previewStyle" @click.stop="onPreviewClick" />
    <Teleport
      :to="selector"
      :disabled="selectOnly"
    >
      <Transition
        :name="bem.ns('fade')"
        appear
      >
        <div v-if="selectOnly ? true : contentVisible" ref="contentRef" :class="bem.be('content')" :style="contentStyle" @click.stop>
          <div ref="selectorRef" :class="bem.be('selector')" @[events.down]="onColorSelectorMousedown">
            <div :class="bem.be('background')">
              <div :class="bem.be('background-handle')" :style="backgroundHandleStyle" />
            </div>
          </div>
          <div ref="hueRef" :class="bem.be('hue')" @[events.down]="onColorHueMousedown">
            <div :class="bem.be('hue-handle')" :style="hueHandleStyle" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
