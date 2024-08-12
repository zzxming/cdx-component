<script setup lang="ts">
</script>

<template>
  <button v-tooltip:bottom="'tip text'">
    hover
  </button>
  <CdxTooltip direction="bottom" text="123">
    <button>
      hover
    </button>
  </CdxTooltip>
</template>
