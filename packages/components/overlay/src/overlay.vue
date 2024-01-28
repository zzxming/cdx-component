<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
const props = withDefaults(
    defineProps<{
        fullscreen: boolean;
    }>(),
    {
        fullscreen: false,
    }
);
const emits = defineEmits(['click']);
const overlayRef = ref<HTMLElement>();

const onMaskClick = (e: MouseEvent) => {
    if (e.currentTarget === e.target) {
        emits('click', e);
    }
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
        :style="{ position: fullscreen ? 'fixed' : 'absolute' }"
        @click="onMaskClick"
        v-bind="$attrs"
    >
        <slot></slot>
    </div>
</template>
