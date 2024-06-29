<script setup lang="ts">
import { useBem } from '@cdx-component/hooks';

defineOptions({ name: 'CdxIcon' });

const [, bem] = useBem('icon');
</script>

<template>
  <i :class="bem.b()">
    <slot />
  </i>
</template>
