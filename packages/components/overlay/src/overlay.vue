<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useBem, useZIndex } from '@cdx-component/hooks';
import { overlayEmits, overlayProps } from './overlay';

const props = defineProps(overlayProps);
const emits = defineEmits(overlayEmits);

const [, bem] = useBem('overlay');
const [, scrollBem] = useBem('scroll');

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
    overlayRef.value?.parentElement?.classList.add(scrollBem.bm('lock'));
});
onUnmounted(() => {
    overlayRef.value?.parentElement?.classList.remove(scrollBem.bm('lock'));
});
</script>

<template>
    <div
        :class="bem.b()"
        ref="overlayRef"
        :style="styleOverlay"
        @click="onMaskClick"
        v-bind="$attrs"
    >
        <slot></slot>
    </div>
</template>
