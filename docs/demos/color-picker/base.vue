<script lang="ts" setup>
import { ref } from 'vue';

const color = ref('#ff0000');
</script>

<template>
  {{ color }}
  <CdxColorPicker v-model="color" />
</template>
