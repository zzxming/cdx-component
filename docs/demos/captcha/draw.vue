<template>
    <CdxCaptcha
        type="slider"
        :image="img"
        :canvasSize="[500, 300]"
        :onRefresh="handleRefresh"
    ></CdxCaptcha>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
const imgs = [
    'https://img.btstu.cn/api/images/5e699637490a3.jpg',
    'https://img.btstu.cn/api/images/5ccfc851275d7.jpg',
    'https://img.btstu.cn/api/images/5e54ceb87fea1.png',
];
const index = ref(1);
const img = computed(() => imgs[index.value]);
const handleRefresh = () => {
    index.value = (index.value + 1) % imgs.length;
    console.log(index.value, img.value);
};
</script>
