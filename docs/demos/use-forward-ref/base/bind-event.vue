<script setup lang="ts">
import { CdxModel, CdxOnlyChild, useForwardRef } from 'cdx-component';
import { ref } from 'vue';

const slotRef = ref<HTMLElement>();
useForwardRef(slotRef);

const handleClick = () => {
  CdxModel.service({
    body: `传入元素标签为：${slotRef.value!.tagName}`,
  });
};
</script>

<template>
  <CdxOnlyChild
    class="cursor"
    @click="handleClick"
  >
    <slot />
  </CdxOnlyChild>
</template>

<style>
.cursor {
  cursor: pointer;
}
</style>
