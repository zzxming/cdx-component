<template>
    <CdxPullRefresh
        v-model="loading"
        @refresh="handleRefresh"
        style="height: 400px"
    >
        <p v-for="i in 20">{{ i }}</p>
    </CdxPullRefresh>
</template>

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
