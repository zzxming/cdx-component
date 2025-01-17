<script setup lang="ts">
import type { StyleValue } from 'vue';
import { useBem, useZIndex } from '@cdx-component/hooks';
import { isString } from '@cdx-component/utils';
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, toRef, watch } from 'vue';
import { menuContextKey } from './constants';
import { menuProps } from './menu';

defineOptions({ name: 'CdxMenu' });
const props = defineProps(menuProps);

const menuContext = inject(menuContextKey);
const [, bem] = useBem('menu');
const { nextZIndex } = useZIndex();

const menuRef = ref<HTMLElement>();
const boundBox = ref({
  left: 0,
  top: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
});
const menuStyle = reactive({
  width: isString(props.width) ? props.width : `${props.width}px`,
  left: props.x,
  top: props.y,
  zIndex: nextZIndex(),
});

const calculateMenuStyle = async () => {
  const zIndex = nextZIndex();
  let width = props.width;
  if (menuContext) {
    width = menuContext.width.value;
  }
  width = isString(width) ? width : `${width}px`;
  Object.assign(menuStyle, {
    width,
    left: props.x,
    top: props.y,
  });
  await nextTick();
  if (menuRef.value) {
    const { left, top, right, bottom, width, height } = menuRef.value.getBoundingClientRect();
    const style = {
      left,
      top,
    };
    let parentRect = { left, top, right, bottom };
    if (menuContext) {
      const rect = menuContext.menuItemRef.value?.getBoundingClientRect();
      if (rect) {
        parentRect = rect;
      }
    }
    if (right > boundBox.value.right) {
      style.left = parentRect.left - width;
    }
    if (left < boundBox.value.left) {
      style.left = parentRect.right;
    }
    if (bottom > boundBox.value.bottom) {
      style.top = parentRect.top - height;
    }
    if (top < boundBox.value.top) {
      style.top = parentRect.bottom;
    }
    Object.assign(menuStyle, style);
  }
  Object.assign(menuStyle, {
    width,
    zIndex,
  });
};

const listStyle = computed<StyleValue>(() => {
  if (!props.contextmenu) {
    return {
      width: menuStyle.width,
    };
  }
  return {
    width: menuStyle.width,
    position: 'fixed',
    zIndex: menuStyle.zIndex,
    left: `${menuStyle.left}px`,
    top: `${menuStyle.top}px`,
  };
});

const updateBoundBox = () => {
  boundBox.value = {
    left: 0,
    top: 0,
    right: document.documentElement.clientWidth,
    bottom: document.documentElement.clientHeight,
  };
};

onMounted(() => {
  updateBoundBox();
  document.addEventListener('resize', updateBoundBox, true);
});
onBeforeUnmount(() => {
  document.addEventListener('resize', updateBoundBox);
});

watch(() => [props.x, props.y, props.width], () => {
  calculateMenuStyle();
}, { immediate: true });

provide(menuContextKey, {
  width: toRef(props, 'width'),
  menuItemRef: ref(undefined),
});
</script>

<template>
  <Transition :name="bem.ns('fade')">
    <div v-if="visible" ref="menuRef" :class="bem.b()" :style="listStyle">
      <slot />
    </div>
  </Transition>
</template>
