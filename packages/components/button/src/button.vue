<script setup lang="ts">
import { CdxIcon, CdxLoadingIcon } from '@cdx-component/components';
import { useBem } from '@cdx-component/hooks';
import { computed } from 'vue';
import { buttonProps } from './button';

defineOptions({ name: 'CdxButton' });
const props = defineProps(buttonProps);

const [, bem] = useBem('button');
const btnClass = computed(() => {
  const classes = [
    bem.b(),
    bem.bm(props.type),
    bem.is('round', props.round),
    bem.is('disabled', props.disabled),
    bem.is('plain', props.plain),
    bem.is('loading', props.loading),
  ];
  if (props.size !== 'default') {
    classes.push(bem.bm(props.size));
  }
  return classes;
});
</script>

<template>
  <button :class="btnClass">
    <CdxIcon v-if="loading">
      <slot name="loading">
        <CdxLoadingIcon visible />
      </slot>
    </CdxIcon>
    <slot name="prefix" />
    <span :class="bem.be('content')"><slot /></span>
    <slot name="suffix" />
  </button>
</template>
