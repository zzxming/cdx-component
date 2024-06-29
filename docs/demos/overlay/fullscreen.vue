<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(false);
</script>

<template>
  <div style="position: relative; height: 200px">
    <button @click="show = true">
      open overlay
    </button>
    <CdxOverlay
      v-model="show"
      fullscreen
      @click="show = false"
    >
      <div style="width: 50%; height: 200px; margin: 300px auto; background-color: #fff">
        此处不会触发 click 事件
      </div>
    </CdxOverlay>
  </div>
</template>
