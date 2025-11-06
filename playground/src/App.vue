<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { useWatermark } from 'cdx-component';
import { reactive, ref, watch } from 'vue';

const isDark = useDark();
const toggleDark = useToggle(isDark);

const containerRef = ref<HTMLElement>();
const content = ref(['cdx-component', '12345']);
const rotate = ref(-22);
const font = reactive({
  fontSize: 14,
  color: '#333',
});
const gap = ref([20, 20]);
useWatermark(containerRef, {
  content,
  rotate,
  font,
  gap,
});

function changeWatermark() {
  content.value[1] = Math.random().toString(36).slice(2);
  rotate.value += 20;
  rotate.value %= 360;
  font.fontSize += 1;
}

watch(
  isDark,
  () => {
    font.color = isDark.value
      ? 'rgba(255, 255, 255, .15)'
      : 'rgba(0, 0, 0, .15)';
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div>
    <div ref="containerRef" class="h-screen" @click="changeWatermark" />
    <button class="border-lg fixed bottom-6 right-6 rounded-lg border p-2 text-slate-500 dark:text-slate-400" @click="toggleDark()">
      {{ isDark ? 'dark' : 'light' }}
    </button>
  </div>
</template>

<style>
body {
  background-color: var(--cdx-bg-color-base);
}
</style>
