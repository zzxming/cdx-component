<template>
    <CdxPullRefresh
        v-model="loading"
        @refresh="handleRefresh"
        style="height: 400px; overflow: auto"
    >
        <p v-for="i in 100">{{ i }}</p>
    </CdxPullRefresh>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const loading = ref(false);

const handleRefresh = () => {
    setTimeout(() => {
        loading.value = false;
    }, 3000);
};
</script>
