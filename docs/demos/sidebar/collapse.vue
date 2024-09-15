<script setup lang="ts">
import { ref } from 'vue';

const model = ref(true);
</script>

<template>
  <div style="height: 300px; border: 1px solid">
    <CdxSidebar v-model="model" direction="left">
      content
      <template #collapse>
        <button style="width: 2rem;height: 2rem">
          {{ model ? '>' : '<' }}
        </button>
      </template>
    </CdxSidebar>
  </div>
</template>
