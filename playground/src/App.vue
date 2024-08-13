<script setup lang="ts">
import { computed, ref } from 'vue';

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
</script>

<template>
  <button v-tooltip:bottom="'tip text'" @click="w = !w">
    hover
  </button>
  <CdxTooltip direction="bottom" text="123">
    <button>
      hover
    </button>
  </CdxTooltip>

  <div v-same-click-target="ww" style="width: 100px; height: 100px; border: 1px solid;">
    <div style="width: 50px; height: 50px; background-color: aliceblue;" />
  </div>
</template>
