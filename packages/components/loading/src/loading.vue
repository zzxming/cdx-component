<script setup lang="ts">
import { CdxLoadingIcon } from '@cdx-component/components';
import { useBem, useLockScroll, useZIndex } from '@cdx-component/hooks';
import { computed, onMounted, ref, watch } from 'vue';
import { loadingProps } from './loading';

defineOptions({ name: 'CdxLoading' });
const props = defineProps(loadingProps);

const [, bem] = useBem('loading');
const { currentZIndex, nextZIndex } = useZIndex();

const loadingRef = ref<HTMLElement>();

const loadingStyle = computed(() => ({
  backgroundColor: props?.background,
  zIndex: props.fullscreen ? currentZIndex.value : undefined,
}));
const isLock = computed(() => props.lock && props.visible);

watch(
  () => [props.visible, props.fullscreen],
  () => {
    if (props.fullscreen && props.visible) {
      nextZIndex();
    }
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  if (loadingRef.value?.parentElement) {
    useLockScroll(isLock, { target: loadingRef.value.parentElement });
  }
});
</script>

<template>
  <Transition
    :name="bem.ns('fade')"
    appear
  >
    <div
      v-if="visible"
      ref="loadingRef"
      :class="[bem.be('mask'), fullscreen && bem.bm('fullscreen')]"
      :style="loadingStyle"
    >
      <div :class="bem.be('tip')">
        <CdxLoadingIcon />
        <span
          v-if="text"
          :class="bem.be('text')"
        >
          {{ text }}
        </span>
      </div>
    </div>
  </Transition>
</template>
