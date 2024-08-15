<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();
const toggleDark = useToggle(isDark);
const clickHandler = (e: MouseEvent) => {
  console.log('click', e);
};
const clickHandler2 = (e: MouseEvent) => {
  console.log('click22', e);
};
const w = ref(true);
const ww = computed(() => {
  return w.value ? clickHandler : clickHandler2;
});
const load = () => {
  console.log('load');
};
</script>

<template>
  <button style="position: fixed; bottom: 24px; right: 24px; padding: 8px; border: 1px solid" @click="toggleDark()">
    {{ isDark ? 'dark' : 'light' }}
  </button>
  <button v-tooltip:bottom="'tip text'" @click="w = !w">
    hover
  </button>
  <CdxTooltip direction="bottom" text="123">
    <button>
      hover
    </button>
  </CdxTooltip>

  <div
    v-same-click-target="ww"
    v-ripple
    v-infinity-scroll="[load, { rootMargin: '0px 0px 100px 0px' }]"
    style="height: 200px; border: 1px solid; overflow: auto;"
  >
    <div style="width: 100px; height: 100px;  border: 1px solid;" />
    <p v-for="i in 50" :key="i">
      {{ i }}
    </p>
  </div>
</template>
