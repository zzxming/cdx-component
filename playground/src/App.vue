<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div>
    <CdxMenu>
      <CdxMenuItem>
        some
      </CdxMenuItem>
      <CdxMenuItem type="break" />
      <CdxMenuItem>
        A
        <template #children>
          <CdxMenuItem>
            some
          </CdxMenuItem>
          <CdxMenuItem>
            some
          </CdxMenuItem>
          <CdxMenuItem type="break" />
          <CdxMenuItem>
            some
          </CdxMenuItem>
        </template>
      </CdxMenuItem>
    </CdxMenu>

    <button class="border-lg fixed bottom-6 right-6 rounded-lg border p-2" @click="toggleDark()">
      {{ isDark ? 'dark' : 'light' }}
    </button>
  </div>
</template>
