<script lang="ts" setup>
import type { WatermarkFontOptions } from 'cdx-component';
import { useWatermark } from 'cdx-component';
import { reactive, ref } from 'vue';

const containerRef = ref<HTMLElement>();
const content = ref(['cdx-component', 'cdx-component']);
const rotate = ref(-22);
const font = reactive<WatermarkFontOptions>({
  color: 'rgba(0,0,0,.15)',
  fontSize: 16,
  fontWeight: 'normal',
  fontFamily: 'sans-serif',
  fontGap: 3,
  textAlign: 'center',
  textBaseline: 'middle',
});
useWatermark(containerRef, {
  content,
  rotate,
  font,
});
</script>

<template>
  <div ref="containerRef" class="h-96" />
</template>
