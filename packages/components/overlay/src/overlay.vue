<script setup lang="ts">
import { StyleValue, computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useBem, useLockScroll, useModelValue } from '@cdx-component/hooks';
import { overlayEmits, overlayProps } from './overlay';

defineOptions({ name: 'CdxOverlay' });
const props = defineProps(overlayProps);
const emits = defineEmits(overlayEmits);

const [, bem] = useBem('overlay');
const [, scrollBem] = useBem('scroll');
const { model } = useModelValue(props, false);

const overlayRef = ref<HTMLElement>();

const overlayStyle = computed<StyleValue>(() => ({
  position: props.fullscreen ? 'fixed' : 'absolute',
}));

const emitClick = (e: MouseEvent) => emits('click', e);
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
    v-same-click-target="emitClick"
    :class="bem.b()"
    :style="overlayStyle"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
