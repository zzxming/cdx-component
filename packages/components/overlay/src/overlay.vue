<script setup lang="ts">
import { watch, ref, nextTick, onBeforeUnmount, onMounted, computed } from 'vue';
import { useBem, useSameClickTarget, useLockScroll, useModelValue } from '@cdx-component/hooks';
import { overlayEmits, overlayProps } from './overlay';

defineOptions({ name: 'CdxOverlay' });
const props = defineProps(overlayProps);
const emits = defineEmits(overlayEmits);

const [, bem] = useBem('overlay');
const [, scrollBem] = useBem('scroll');

const overlayRef = ref<HTMLElement>();

const { model } = useModelValue(props, false);
const { onMouseDown, onMouseUp, onClick } = useSameClickTarget((e) => emits('click', e));

const overlayStyle = computed(() => ({
    position: props.fullscreen ? 'fixed' : 'absolute',
}));

watch(
    () => model,
    async () => {
        await nextTick();
        overlayRef.value?.parentElement?.classList[model.value ? 'add' : 'remove'](scrollBem.bm('lock'));
    },
    {
        immediate: true,
    }
);

onMounted(() => {
    useLockScroll(model, { target: overlayRef.value?.parentElement! });
});
onBeforeUnmount(() => {
    overlayRef.value?.parentElement?.classList.remove(scrollBem.bm('lock'));
});
</script>

<template>
    <div
        :class="bem.b()"
        ref="overlayRef"
        v-show="model"
        @click="onClick"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        :style="overlayStyle"
        v-bind="$attrs"
    >
        <slot></slot>
    </div>
</template>
