<script lang="ts" setup>
import { ref } from 'vue';

const loading = ref(false);

const handleRefresh = () => {
  console.log('refresh');
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};
</script>

<template>
  <CdxPullRefresh
    v-model="loading"
    style="height: 400px"
    @refresh="handleRefresh"
  >
    <p
      v-for="i in 20"
      :key="i"
    >
      {{ i }}
    </p>
  </CdxPullRefresh>
</template>
