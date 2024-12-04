<script lang="ts" setup>
import { ref } from 'vue';

const color = ref('#ff0000');
</script>

<template>
  <div>
    <div :style="{ width: '20px', height: '20px', backgroundColor: color }" /><CdxColorPicker v-model="color" />
  </div>
</template>
