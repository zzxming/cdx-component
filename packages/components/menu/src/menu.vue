<script setup lang="ts">
import { useBem } from '@cdx-component/hooks';
import { menuEmits, menuProps } from './menu';

defineOptions({ name: 'CdxMenu' });
const props = defineProps(menuProps);
const emits = defineEmits(menuEmits);

const [, bem] = useBem('menu');
</script>

<template>
  <div :class="bem.b()">
    <slot />
  </div>
</template>
