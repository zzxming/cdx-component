<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div>
    <button class="border-lg fixed bottom-6 right-6 rounded-lg border p-2" @click="toggleDark()">
      {{ isDark ? 'dark' : 'light' }}
    </button>
  </div>
</template>
