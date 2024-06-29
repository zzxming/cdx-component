<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(true);
</script>

<template>
  <div style="position: relative; height: 200px">
    <CdxOverlay v-model="show" />
  </div>
</template>
