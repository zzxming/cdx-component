<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useBem, useLockScroll, useModelValue, useZIndex } from '@cdx-component/hooks';
import { vSameClickTarget } from '@cdx-component/directives';
import { overlayEmits, overlayProps } from './overlay';

defineOptions({ name: 'CdxOverlay' });
const props = defineProps(overlayProps);
const emits = defineEmits(overlayEmits);

const [, bem] = useBem('overlay');
const [, scrollBem] = useBem('scroll');
const { model } = useModelValue(props, false);
const { nextZIndex } = useZIndex();

const overlayRef = ref<HTMLElement>();
const zIndex = ref(nextZIndex());

const overlayStyle = computed<StyleValue>(() => ({
  position: props.fullscreen ? 'fixed' : 'absolute',
  zIndex: zIndex.value,
}));

const emitClick = (e: Event) => emits('click', e);
watch(
  model,
  async (val) => {
    await nextTick();
    overlayRef.value?.parentElement?.classList[val ? 'add' : 'remove'](scrollBem.bm('lock'));
    if (val) {
      zIndex.value = nextZIndex();
    }
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  if (overlayRef.value?.parentElement) {
    useLockScroll(model, { target: overlayRef.value.parentElement });
  }
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
