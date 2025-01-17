<script setup lang="ts">
import type { HSB } from '@cdx-component/utils';
import type { ComponentPublicInstance, StyleValue } from 'vue';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { useBem, useModelValue, useSupportTouch, useTeleportContainer, useZIndex } from '@cdx-component/hooks';
import { HSBtoHEX, HSBtoRGB, RGBtoHEX, RGBtoHSB, stringToRGBColor, validateHSB } from '@cdx-component/utils';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { colorPickerEmits, colorPickerProps } from './color-picker';

defineOptions({ name: 'CdxColorPicker' });
const props = defineProps(colorPickerProps);
const emits = defineEmits(colorPickerEmits);

const [, bem] = useBem('color-picker');
const { events, defineEventPosition } = useSupportTouch();
const { nextZIndex } = useZIndex();
const { selector } = useTeleportContainer(bem.be('container'));

const panelWidth = 230;
const panelHeight = 150;
// match less variable @handleSizeSec
const handleSizeSec = 10;
let internalChange = true;
const colorInput = ['r', 'g', 'b', 'a'] as const;

const panelRef = ref<HTMLElement>();
const previewRef = ref<HTMLElement>();
const selectorRef = ref<HTMLElement>();
const alphaRef = ref<HTMLElement>();
const hueRef = ref<HTMLElement>();
const colorInputRefs = ref<{
  [K in typeof colorInput[number]]: HTMLInputElement | null;
}>({
  r: null,
  g: null,
  b: null,
  a: null,
});
const hueDragging = ref(false);
const colorDragging = ref(false);
const alphaDragging = ref(false);
const contentVisible = ref(false);
const { model } = useModelValue(props, 'rgb(0, 0, 0)');

const hsbValue = computed({
  get() {
    return RGBtoHSB(stringToRGBColor(model.value, 'rgb(0, 0, 0)'));
  },
  set(value) {
    let changeValue: string = `#${HSBtoHEX(value)}`;
    if (props.outputColorType === 'rgba') {
      const rgba = HSBtoRGB(value);
      changeValue = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
    }
    model.value = changeValue;
  },
});
const backgroundHandleStyle = computed<StyleValue>(() => ({
  left: `${Math.floor((panelWidth * hsbValue.value.s) / 100)}px`,
  top: `${Math.floor((panelHeight * (100 - hsbValue.value.b)) / 100)}px`,
}));
const hueHandleStyle = computed<StyleValue>(() => ({
  top: `${Math.floor(panelHeight - (panelHeight * hsbValue.value.h) / 360)}px`,
}));
const previewStyle = computed<StyleValue>(() => ({
  backgroundColor: `#${HSBtoHEX(hsbValue.value)}`,
}));
const rootStyle = computed<StyleValue>(() => ({
  display: props.selectOnly ? 'block' : undefined,
}));
const panelStyle = computed<StyleValue>(() => ({
  position: props.selectOnly ? 'static' : undefined,
}));
const alphaStyle = computed<StyleValue>(() => {
  const { r, g, b } = HSBtoRGB(hsbValue.value);
  return {
    background: `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgb(${r}, ${g}, ${b}, 1) 100%)`,
  };
});
const alphaHandleStyle = computed<StyleValue>(() => ({
  left: `${hsbValue.value.a * 100}%`,
}));
const selectorStyle = computed<StyleValue>(() => ({
  backgroundColor: `#${RGBtoHEX(HSBtoRGB({
    h: hsbValue.value.h,
    s: 100,
    b: 100,
    a: 1,
  }))}`,
}));

const seInputRef = (el: Element | ComponentPublicInstance | null, item: typeof colorInput[number]) => {
  colorInputRefs.value[item] = el as HTMLInputElement;
};
const updateInputValue = () => {
  const hex = HSBtoHEX(hsbValue.value);
  for (const [i, input] of Object.values(colorInputRefs.value).entries()) {
    if (input) {
      input.value = String(Number.parseInt(hex[i * 2] + hex[i * 2 + 1], 16));
    }
  }
  if (colorInputRefs.value.a) {
    colorInputRefs.value.a.value = String(Math.round(hsbValue.value.a * 100));
  }
};
const updateContentPosition = async () => {
  await nextTick();
  if (!panelRef.value || !previewRef.value) return;

  const elementDimensions = { width: panelRef.value.offsetWidth, height: panelRef.value.offsetHeight };
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

  const left = targetOffset.left + elementDimensions.width > window.innerWidth
    ? Math.max(0, targetOffset.left + scrollX + targetDimensions.width - elementDimensions.width)
    : targetOffset.left + scrollX;

  Object.assign(panelRef.value.style, {
    top: `${top}px`,
    left: `${left}px`,
    zIndex: nextZIndex(),
  });

  updateInputValue();
};
const updateValue = (value: Partial<HSB>, internal: boolean = true) => {
  internalChange = internal;
  hsbValue.value = validateHSB(Object.assign({}, hsbValue.value, value));
  updateInputValue();
};
const pickColor = (event: Event) => {
  if (!selectorRef.value) return;
  const { pageX, pageY } = defineEventPosition(event);
  const rect = selectorRef.value.getBoundingClientRect();
  const top = rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
  const left = rect.left + document.body.scrollLeft;
  const saturation = Math.floor((100 * Math.max(0, Math.min(panelWidth, pageX - left))) / panelWidth);
  const brightness = Math.floor((100 * (panelHeight - Math.max(0, Math.min(panelHeight, pageY - top)))) / panelHeight);

  updateValue({
    s: saturation,
    b: brightness,
  });
};
const pickHue = (event: Event) => {
  if (!hueRef.value) return;
  const { pageY } = defineEventPosition(event);
  const top = hueRef.value.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);

  updateValue({
    h: Math.floor((360 * (panelHeight - Math.max(0, Math.min(panelHeight, pageY - top)))) / panelHeight),
  });
};
const pickAlpha = (event: Event) => {
  if (!alphaRef.value) return;
  const { pageX } = defineEventPosition(event);
  const rect = alphaRef.value.getBoundingClientRect();
  let left = pageX - rect.left;
  left = Math.max(handleSizeSec / 2, left);
  left = Math.min(left, rect.width - handleSizeSec / 2);

  updateValue({
    a: Math.round(((left - handleSizeSec / 2) / (rect.width - handleSizeSec)) * 100) / 100,
  });
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

  if (alphaDragging.value) {
    pickAlpha(event);
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
const onColorHueMousedown = (event: Event) => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', onColorHueDragEnd);
  hueDragging.value = true;
  pickHue(event);
};
const onColorAlphaDragEnd = () => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', onColorAlphaDragEnd);
  alphaDragging.value = false;
};
const onAlphaMousedown = (event: Event) => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', onColorAlphaDragEnd);
  alphaDragging.value = true;
  pickAlpha(event);
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
const inputNumberLimit = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.value = target.value.replaceAll(/\D/g, '');
};
const onInputChange = (key: typeof colorInput[number], event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = Math.round(Number(target.value));
  if (key === 'a') {
    value = value / 100;
  }
  const result = validateHSB(RGBtoHSB(Object.assign({}, HSBtoRGB(hsbValue.value), { [key]: value })));
  updateValue(result);
};

onMounted(() => {
  updateInputValue();
});
onBeforeUnmount(() => {
  onColorAlphaDragEnd();
  onColorHueDragEnd();
  onColorSelectorDragEnd();
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
        <div v-if="selectOnly ? true : contentVisible" ref="panelRef" :class="bem.be('panel')" :style="panelStyle" @click.stop>
          <div :class="bem.be('content')">
            <div ref="selectorRef" :class="bem.be('selector')" :style="selectorStyle" @[events.down]="onColorSelectorMousedown">
              <div :class="bem.be('background')">
                <div :class="bem.be('background-handle')" :style="backgroundHandleStyle" />
              </div>
            </div>
            <div ref="hueRef" :class="bem.be('hue')" @[events.down]="onColorHueMousedown">
              <div :class="bem.be('hue-handle')" :style="hueHandleStyle" />
            </div>
            <div ref="alphaRef" :class="bem.be('alpha')" @[events.down]="onAlphaMousedown">
              <div :class="bem.be('alpha-bg')" :style="alphaStyle" />
              <div :class="bem.be('alpha-handle')" :style="alphaHandleStyle" />
            </div>
          </div>
          <div :class="bem.be('action')">
            <div
              v-for="item in colorInput" :key="item"
              :class="[bem.be('action-item'), item]"
            >
              <label>{{ item.toUpperCase() }}</label>
              <input
                :ref="(el) => seInputRef(el, item)"
                :class="bem.be('action-input')"
                @input="inputNumberLimit"
                @change="(e) => onInputChange(item, e)"
              >
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
