<script setup lang="ts">
import { CdxResize } from 'cdx-component';
</script>

<template>
  <CdxResize :directions="['top', 'right', 'left', 'bottom']">
    <div style="width: 100px; height: 100px; background-color: #333;" />
  </CdxResize>
</template>
