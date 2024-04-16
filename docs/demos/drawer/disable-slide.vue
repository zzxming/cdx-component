<template>
    <CdxDrawer
        v-model="show1"
        :bodySlide="false"
    >
        <template #swipe>
            <div class="swipe_content">向左滑动</div>
        </template>
        <div>不可拖拽此处关闭</div>
    </CdxDrawer>

    <CdxDrawer
        v-model="show2"
        :slide="false"
    >
        <template #swipe>
            <div
                class="swipe_content"
                @click="show2 = !show2"
            >
                不支持拖拽，可点击打开
            </div>
        </template>
        <div>可点击蒙层关闭</div>
    </CdxDrawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const show1 = ref(false);
const show2 = ref(false);
</script>

<style scoped>
.swipe_content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
}
</style>
