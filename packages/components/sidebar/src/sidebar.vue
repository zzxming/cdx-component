<script setup lang="ts">
import { CdxOverlay } from '@cdx-component/components';
import { useBem, useModelValue, useZIndex } from '@cdx-component/hooks';
import { isNumber } from '@cdx-component/utils';
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import { sidebarProps } from './sidebar';

defineOptions({ name: 'CdxSidebar' });
const props = defineProps(sidebarProps);

const slots = useSlots();
const [, bem] = useBem('sidebar');
const { nextZIndex } = useZIndex();
const { model } = useModelValue(props, false);

const sidebarRef = ref();
const collapseRef = ref();
const zIndex = ref(nextZIndex());
const changeStatus = ref(false);

let originOverflowY = '';
let originOverflowX = '';
let originTransform = '';

const isHorizontal = computed(() => ['left', 'right'].includes(props.direction));
const sidebarClassName = computed(() => {
  const className = {
    right: 'ltr',
    left: 'rtl',
    top: 'btt',
    bottom: 'ttb',
  };
  return `${className[props.direction]}`;
});
const sidebarStyle = computed(() => {
  const style = {
    zIndex: zIndex.value,
    boxShadow: model.value ? undefined : 'none',
  };
  if (isHorizontal.value) {
    Object.assign(style, {
      width: isNumber(props.size) ? `${props.size}px` : props.size,
      heigh: '100%',
    });
  }
  else {
    Object.assign(style, {
      height: isNumber(props.size) ? `${props.size}px` : props.size,
      width: '100%',
    });
  }
  if (changeStatus.value) {
    Object.assign(style, {
      transition: 'transform .3s linear',
      boxShadow: undefined,
    });
  }
  return style;
});
const collapseStyle = computed(() => {
  const stylePosition = {
    right: 'left',
    left: 'right',
    top: 'bottom',
    bottom: 'top',
  };
  const reverseDirection = stylePosition[props.direction];
  const style = {
    [reverseDirection]: '100%',
    [isHorizontal.value ? 'top' : 'left']: '50%',
    transform: `translate${isHorizontal.value ? 'Y' : 'X'}(-50%)`,
    [`border-${reverseDirection}`]: 'none',
  };
  if (['left', 'right'].includes(props.direction)) {
    Object.assign(style, {
      [`border-top-${reverseDirection}-radius`]: '0',
      [`border-bottom-${reverseDirection}-radius`]: '0',
    });
  }
  else {
    Object.assign(style, {
      [`border-${reverseDirection}-left-radius`]: '0',
      [`border-${reverseDirection}-right-radius`]: '0',
    });
  }
  return style;
});

const saveParentStyle = () => {
  if (!sidebarRef.value.parentElement) return;
  const {
    overflowY,
    overflowX,
    transform,
  } = window.getComputedStyle(sidebarRef.value.parentElement);
  if (isHorizontal.value) {
    originOverflowX = overflowX;
    sidebarRef.value.parentElement.style.overflowX = 'hidden';
  }
  else {
    originOverflowY = overflowY;
    sidebarRef.value.parentElement.style.overflowY = 'hidden';
  }
  if (transform === 'none') {
    originTransform = transform;
    sidebarRef.value.parentElement.style.transform = 'translate3d(0, 0, 0)';
  }
};
const resetParentStyle = (direction: string) => {
  if (sidebarRef.value.parentElement) {
    if (['left', 'right'].includes(direction)) {
      sidebarRef.value.parentElement.style.overflowX = originOverflowX;
    }
    else {
      sidebarRef.value.parentElement.style.overflowY = originOverflowY;
    }
    if (originTransform) {
      sidebarRef.value.parentElement.style.transform = originTransform;
    }
  }
};
const handleTransitionEnd = () => {
  changeStatus.value = false;
};
const toggle = () => {
  model.value = !model.value;
};

watch(model, (val) => {
  if (val) {
    zIndex.value = nextZIndex();
  }
  changeStatus.value = true;
});
watch(
  () => props.direction,
  (_, oldVal) => {
    resetParentStyle(oldVal);
    saveParentStyle();
  },
);

onMounted(() => {
  saveParentStyle();
});
onBeforeUnmount(() => {
  resetParentStyle(props.direction);
});
</script>

<template>
  <Teleport
    to="body"
    :disabled="!fullscreen"
  >
    <Transition
      :name="bem.ns('fade')"
      appear
    >
      <CdxOverlay
        v-if="mask"
        v-model="model"
        :style="{ zIndex }"
        @click="toggle"
      />
    </Transition>
    <div
      ref="sidebarRef"
      :class="[bem.b(), sidebarClassName, model && 'active']"
      :style="sidebarStyle"
      @transitionend="handleTransitionEnd"
    >
      <div :class="bem.be('content')">
        <slot />
      </div>

      <div
        v-if="slots.collapse"
        ref="collapseRef"
        :class="bem.be('collapse')"
        :style="collapseStyle"
        @click="toggle"
      >
        <slot name="collapse" />
      </div>
    </div>
  </Teleport>
</template>
