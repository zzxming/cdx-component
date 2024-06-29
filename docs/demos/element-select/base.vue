<script lang="ts" setup>
import { ref } from 'vue';

const value = ref([]);
</script>

<template>
  <CdxElementSelect
    v-model="value"
    :max="10"
  >
    <CdxElementSelectItem
      v-for="i in 40"
      :key="i"
      class="item"
      :true-value="i"
    >
      {{ i }}
    </CdxElementSelectItem>
  </CdxElementSelect>
</template>

<style scoped>
.item {
    padding: 8px;
}
</style>
