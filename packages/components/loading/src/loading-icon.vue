<script setup lang="ts">
import { useBem } from '@cdx-component/hooks';

defineOptions({ name: 'CdxLoadingIcon' });

const [, bem] = useBem('loading');
</script>

<template>
  <svg
    :class="bem.be('spinner')"
    viewBox="0 0 50 50"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
    />
  </svg>
</template>
