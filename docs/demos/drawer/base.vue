<template>
    <CdxDrawer v-model="show">
        <template #swipe>
            <div class="swipe_content">向左滑动</div>
        </template>
        <div>drawer content</div>
    </CdxDrawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(false);
</script>

<style scoped>
.swipe_content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
}
</style>
