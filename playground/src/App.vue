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

const vertialData = ref(new Array(20).fill(0).map((_, i) => ({ value: i })));
const addData = (val: typeof vertialData) => {
  val.value.push(...(new Array(20).fill(0).map((_, i) => ({ value: i }))));
};
const load = () => {
  console.log('load');
  addData(vertialData);
};
const infinityOption = computed(() => [load, { rootMargin: '0px 0px 100px 0px' }]);
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
    v-infinity-scroll="infinityOption"
    style="height: 200px; border: 1px solid; overflow: auto;"
  >
    <p v-for="i in vertialData" :key="i.value">
      {{ i.value }}
    </p>
  </div>
  <div
    v-infinity-scroll="infinityOption"
    style="display: flex; border: 1px solid; overflow: auto;"
  >
    <p v-for="i in vertialData" :key="i.value" style="width: 120px; flex-shrink: 0;">
      {{ i.value }}
    </p>
  </div>
  <div
    v-same-click-target="ww"
    v-ripple
    style="height: 200px; border: 1px solid; overflow: auto;"
  >
    <div style="width: 100px; height: 100px;  border: 1px solid;" />
  </div>
</template>
