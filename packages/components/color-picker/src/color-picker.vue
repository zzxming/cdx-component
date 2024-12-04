<script setup lang="ts">
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { useBem, useSupportTouch } from '@cdx-component/hooks';
import { HEXtoRGB, HSBtoHEX, HSBtoRGB, RGBtoHSB, validateHSB } from '@cdx-component/utils';
import { computed, onMounted, ref, watch } from 'vue';
import { colorPickerEmits, colorPickerProps } from './color-picker';

defineOptions({ name: 'CdxColorPicker' });
const props = defineProps(colorPickerProps);
const emits = defineEmits(colorPickerEmits);

const [, bem] = useBem('color-picker');
const { events, defineEventPosition } = useSupportTouch();

let internalChange = true;

const selectorRef = ref<HTMLElement>();
const hueRef = ref<HTMLElement>();
const hueDragging = ref(false);
const colorDragging = ref(false);
const hsbValue = ref(RGBtoHSB(HEXtoRGB(props.modelValue || '#ff0000')));

const backgroundHandleStyle = computed(() => ({
  left: `${Math.floor((150 * hsbValue.value.s) / 100)}px`,
  top: `${Math.floor((150 * (100 - hsbValue.value.b)) / 100)}px`,
}));
const hueHandleStyle = computed(() => ({
  top: `${Math.floor(150 - (150 * hsbValue.value.h) / 360)}px`,
}));

const updateSelectorStyle = () => {
  if (!selectorRef.value) return;
  const rgb = HSBtoRGB(hsbValue.value);
  selectorRef.value.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
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

onMounted(() => {
  updateSelectorStyle();
});

watch(hsbValue, () => {
  if (internalChange) {
    internalChange = false;
    emits(UPDATE_MODEL_EVENT, `#${HSBtoHEX(hsbValue.value)}`);
  }
}, { immediate: true });
</script>

<template>
  <div :class="bem.b()">
    <div :class="bem.be('content')">
      <div ref="selectorRef" :class="bem.be('selector')" @[events.down]="onColorSelectorMousedown">
        <div :class="bem.be('background')">
          <div :class="bem.be('background-handle')" :style="backgroundHandleStyle" />
        </div>
      </div>
      <div ref="hueRef" :class="bem.be('hue')" @[events.down]="onColorHueMousedown">
        <div :class="bem.be('hue-handle')" :style="hueHandleStyle" />
      </div>
    </div>
  </div>
</template>
