<script setup lang="ts">
import { CdxIcon, CdxLoadingIcon } from '@cdx-component/components';
import { useBem } from '@cdx-component/hooks';
import { TinyColor } from '@ctrl/tinycolor';
import { computed } from 'vue';
// import tinyColor from 'tinycolor2';
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
const btnStyle = computed(() => {
  const value: Record<string, any> = {};
  if (props.color) {
    const color = new TinyColor(props.color);
    const lighter2 = (props.dark ? color.shade(80) : color.tint(80)).toString();
    const lighter3 = (props.dark ? color.shade(70) : color.tint(70)).toString();
    const lighter5 = (props.dark ? color.shade(50) : color.tint(50)).toString();
    const lighter7 = (props.dark ? color.shade(30) : color.tint(30)).toString();
    const lighter9 = props.color;
    value[bem.cv('button-text-color')] = props.plain ? lighter9 : `var(${bem.cv('color-white')})`;
    value[bem.cv('button-border-color')] = props.plain ? lighter2 : lighter7;
    value[bem.cv('button-bg-color')] = props.plain ? lighter3 : lighter9;
    value[bem.cv('button-hover-text-color')] = `var(${bem.cv('color-white')})`;
    value[bem.cv('button-hover-border-color')] = props.plain ? lighter7 : lighter5;
    value[bem.cv('button-hover-bg-color')] = props.plain ? lighter9 : lighter7;
    value[bem.cv('button-disabled-text-color')] = props.plain ? lighter7 : `var(${bem.cv('color-white')})`;
    value[bem.cv('button-disabled-border-color')] = props.plain ? lighter3 : lighter5;
    value[bem.cv('button-disabled-bg-color')] = props.plain ? lighter2 : lighter5;
  }
  return value;
});
</script>

<template>
  <button :class="btnClass" :style="btnStyle">
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
