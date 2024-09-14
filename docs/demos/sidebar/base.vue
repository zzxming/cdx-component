<script setup lang="ts">
import { ref } from 'vue';

const model = ref(true);
type Direction = 'top' | 'right' | 'bottom' | 'left';
const directionMap: Direction[] = ['top', 'right', 'bottom', 'left'];
const direction = ref<Direction>(directionMap[3]);
</script>

<template>
  <div>
    <label
      v-for="d in directionMap"
      :key="d"
      style="margin-right: 4px"
    >
      <input
        v-model="direction"
        type="radio"
        :value="d"
      >
      {{ d }}
    </label>
  </div>
  <div style="height: 300px; border: 1px solid" @click="model = !model">
    <CdxSidebar v-model="model" :direction="direction" :size="100">
      content
    </CdxSidebar>
  </div>
</template>
