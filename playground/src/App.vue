<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { useSlide } from 'cdx-component';
import { computed, ref } from 'vue';

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

const boxRef = ref();
const { movePosition } = useSlide(boxRef);

const tabs = [
  {
    value: 'a2bcx4',
    label: '燃料电池材料',
  },
  {
    value: 'abse3',
    label: '层状陶瓷材料',
  },
  {
    value: 'dalloys',
    label: '碳化硅复合材料',
  },
  {
    value: 'mp-gllbsc',
    label: '太阳能电池材料',
  },
  {
    value: 'thermo-electric',
    label: '热电材料',
  },
];
const currentTab = ref(tabs[0].value);
</script>

<template>
  {{ currentTab }}
  <CdxTabs
    v-model="currentTab"
    :tabs="tabs"
    position="right"
  >
    content
  </CdxTabs>

  <div ref="boxRef" :style="{ transform: `translate(${movePosition[0]}px, ${movePosition[1]}px)`, backgroundColor: 'black', width: '40px', height: '40px' }" />

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
