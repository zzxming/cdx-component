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
    console.log(props.dark);
    const lighter2 = (props.dark ? color.shade(24) : color.tint(24)).toString();
    const lighter3 = (props.dark ? color.shade(36) : color.tint(36)).toString();
    const lighter4 = (props.dark ? color.shade(48) : color.tint(48)).toString();
    const lighter5 = (props.dark ? color.shade(60) : color.tint(60)).toString();
    const lighter7 = (props.dark ? color.shade(84) : color.tint(84)).toString();
    value[bem.cv('button-text-color')] = props.plain ? props.color : `var(${bem.cv('color-white')})`;
    value[bem.cv('button-bg-color')] = props.plain ? lighter7 : props.color;
    value[bem.cv('button-border-color')] = props.plain ? lighter4 : props.color;
    value[bem.cv('button-hover-text-color')] = `var(${bem.cv('color-white')})`;
    value[bem.cv('button-hover-bg-color')] = props.plain ? props.color : lighter3;
    value[bem.cv('button-hover-border-color')] = props.plain ? props.color : lighter3;
    value[bem.cv('button-disabled-text-color')] = props.plain ? lighter2 : `var(${bem.cv('color-white')})`;
    value[bem.cv('button-disabled-bg-color')] = props.plain ? lighter7 : lighter5;
    value[bem.cv('button-disabled-border-color')] = lighter5;
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
