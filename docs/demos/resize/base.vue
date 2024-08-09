<script setup lang="ts">
import { ref } from 'vue';

const directions = ref(['bottom', 'right']);
</script>

<template>
  <CdxResize :directions="directions">
    <div style="width: 100px; height: 100px; background-color: #333;" />
  </CdxResize>
</template>
