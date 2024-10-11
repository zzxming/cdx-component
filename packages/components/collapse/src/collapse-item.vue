<script setup lang="ts">
import { CdxCollapseTransition } from '@cdx-component/components';
import { useBem } from '@cdx-component/hooks';
import { computed, inject } from 'vue';
import { collapseItemEmits, collapseItemProps } from './collapse-item';
import { collapseContextKey } from './constants';

defineOptions({ name: 'CdxCollapseItem' });
const props = defineProps(collapseItemProps);
const emits = defineEmits(collapseItemEmits);

const collapseContext = inject(collapseContextKey);
const [, bem] = useBem('collapse-item');

const isActive = computed(() =>
  collapseContext ? collapseContext.activeNames.value.includes(props.name) : props.expend,
);

const handleItemClick = () => {
  if (collapseContext) {
    collapseContext.handleItemClick(props.name);
  }
  else {
    emits('update:expend', !props.expend);
  }
};
</script>

<template>
  <div :class="bem.b()">
    <button
      :class="bem.be('header')"
      tabindex="0"
      @click="handleItemClick"
    >
      <slot name="title" :title="title">
        {{ title }}
      </slot>
    </button>
    <CdxCollapseTransition>
      <div
        v-if="isActive"
        :class="bem.be('content')"
      >
        <slot />
      </div>
    </CdxCollapseTransition>
  </div>
</template>
