<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div>
    <button style="position: fixed; bottom: 24px; right: 24px; padding: 8px; border: 1px solid" @click="toggleDark()">
      {{ isDark ? 'dark' : 'light' }}
    </button>
  </div>
</template>
