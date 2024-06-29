<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(false);
</script>

<template>
  <button @click="show = !show">
    打开
  </button>
  <CdxDrawer
    v-model="show"
    fullscreen
  >
    <div>drawer content</div>
  </CdxDrawer>
</template>

<style scoped>
.swipe_content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
}
button {
    padding: 4px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
