<script setup lang="ts">
import { useBem } from '@cdx-component/hooks';
import { computed } from 'vue';
import { textHighlightProps } from './text-highlight';

defineOptions({ name: 'CdxTextHighlight' });
const props = defineProps(textHighlightProps);

const [, bem] = useBem('text-highlight');

const textKeywords = computed(() => {
  if (Array.isArray(props.texts)) {
    return props.texts.filter(v => !!v);
  }
  return props.texts ? [props.texts] : [];
});
const textMatchReg = computed(() => {
  if (textKeywords.value.length === 0) return /^(?!)$/g;
  return new RegExp(`(${textKeywords.value.join('|')})`, `g${props.ignoreCase ? 'i' : ''}`);
});
const splitedContent = computed(() =>
  props.content.split(textMatchReg.value).map(text => ({ isKey: textMatchReg.value.test(text), text })),
);
</script>

<template>
  <div :class="bem.b()">
    <template v-for="text in splitedContent">
      <slot
        v-if="text.isKey"
        name="highlight"
        :text="text.text"
      >
        <component
          :is="props.highlightTag"
          :class="[bem.be('highlight'), highlightClass]"
        >
          {{ text.text }}
        </component>
      </slot>
      <template v-else>
        <slot :text="text.text">
          {{ text.text }}
        </slot>
      </template>
    </template>
  </div>
</template>
