<script setup lang="ts">
import { watch, ref, nextTick, onBeforeUnmount } from 'vue';
import { useBem, useSameClickTarget } from '@cdx-component/hooks';
import { overlayEmits, overlayProps } from './overlay';

const props = defineProps(overlayProps);
const emits = defineEmits(overlayEmits);

const [, bem] = useBem('overlay');
const [, scrollBem] = useBem('scroll');

const overlayRef = ref<HTMLElement>();

const { onMouseDown, onMouseUp, onClick } = useSameClickTarget((e) => emits('click', e));

const styleOverlay = {
    position: props.fullscreen ? 'fixed' : 'absolute',
};

watch(
    () => props.visible,
    async () => {
        await nextTick();
        overlayRef.value?.parentElement?.classList[props.visible ? 'add' : 'remove'](scrollBem.bm('lock'));
    },
    {
        immediate: true,
    }
);

onBeforeUnmount(() => {
    overlayRef.value?.parentElement?.classList.remove(scrollBem.bm('lock'));
});
</script>

<template>
    <div
        :class="bem.b()"
        ref="overlayRef"
        v-show="visible"
        :style="styleOverlay"
        @click="onClick"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        v-bind="$attrs"
    >
        <slot></slot>
    </div>
</template>
