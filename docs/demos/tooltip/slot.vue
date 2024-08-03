<template>
  <CdxTooltip text="top tip" direction="top">
    <button>
      hover
    </button>
    <template #content="{ text }">
      <strong>{{ text }}</strong>
    </template>
  </CdxTooltip>
</template>
