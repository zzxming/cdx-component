<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useBem, useLockScroll, useModelValue, useSameClickTarget } from '@cdx-component/hooks';
import { overlayEmits, overlayProps } from './overlay';

defineOptions({ name: 'CdxOverlay' });
const props = defineProps(overlayProps);
const emits = defineEmits(overlayEmits);

const [, bem] = useBem('overlay');
const [, scrollBem] = useBem('scroll');
const { model } = useModelValue(props, false);
const { onMouseDown, onMouseUp, onClick } = useSameClickTarget(e => emits('click', e));

const overlayRef = ref<HTMLElement>();

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
  },
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
    v-show="model"
    ref="overlayRef"
    :class="bem.b()"
    :style="overlayStyle"
    v-bind="$attrs"
    @click="onClick"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  >
    <slot />
  </div>
</template>
