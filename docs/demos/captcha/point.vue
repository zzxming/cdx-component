<script lang="ts" setup>
import type { CheckStatusInfo } from 'cdx-component';
import { computed, ref } from 'vue';

const imgs = [
  'https://img.btstu.cn/api/images/5e699637490a3.jpg',
  'https://img.btstu.cn/api/images/5ccfc851275d7.jpg',
  'https://img.btstu.cn/api/images/5e54ceb87fea1.png',
];
const index = ref(0);
const img = computed(() => imgs[index.value]);
const texts = ref('ABCD'.split(''));
const handleRefresh = () => {
  index.value = (index.value + 1) % imgs.length;
};
const handleSuccess = () => {
  return new Promise<CheckStatusInfo>((resolve) => {
    setTimeout(() => {
      resolve({
        success: false,
        message: '验证失败',
      });
    }, 2000);
  });
};
</script>

<template>
  <CdxCaptcha
    type="pointer"
    :image="img"
    :texts="texts"
    :canvas-size="[500, 300]"
    :on-refresh="handleRefresh"
    :on-befor-success="handleSuccess"
    :tip-duration="3000"
  />
</template>
