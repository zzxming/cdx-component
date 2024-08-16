<script setup lang="ts">
import { ref } from 'vue';

const text = ref('bar');
const clickHandler = () => {
  text.value = text.value === 'bar' ? 'foo' : 'bar';
};
</script>

<template>
  <div
    v-same-click-target="clickHandler"
    style="height: 200px; border: 1px solid;"
  >
    <div style="width: 200px; height: 100px;  border: 1px solid;">
      click here will not trigger bind event
    </div>
    {{ text }}
  </div>
</template>
