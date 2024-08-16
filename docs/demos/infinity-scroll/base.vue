<script setup lang="ts">
import { ref } from 'vue';

const data = ref(new Array(20).fill(0).map((_, i) => i));
const load = () => {
  data.value.push(...(new Array(20).fill(0).map((_, i) => i)));
};
</script>

<template>
  <div
    v-infinity-scroll="load"
    style="height: 200px; border: 1px solid; overflow: auto;"
  >
    <p v-for="(v, i) in data" :key="i">
      {{ v }}
    </p>
  </div>
</template>
