<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useZIndex } from '@cdx-component/hooks';
import { overlayProps } from './overlay';

const props = defineProps(overlayProps);
const emits = defineEmits(['click']);
const overlayRef = ref<HTMLElement>();

const onMaskClick = (e: MouseEvent) => {
    if (e.currentTarget === e.target) {
        emits('click', e);
    }
};
const styleOverlay = {
    position: props.fullscreen ? 'fixed' : 'absolute',
    zIndex: useZIndex().nextZIndex(),
};
onMounted(() => {
    overlayRef.value?.parentElement?.classList.add('scroll-lock');
});
onUnmounted(() => {
    overlayRef.value?.parentElement?.classList.remove('scroll-lock');
});
</script>

<template>
    <div
        class="overlay"
        ref="overlayRef"
        :style="styleOverlay"
        @click="onMaskClick"
        v-bind="$attrs"
    >
        <slot></slot>
    </div>
</template>
