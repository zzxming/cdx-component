<script lang="ts" setup>
const types = ['default', 'primary', 'success', 'warning', 'danger', 'info'];
</script>

<template>
  <div class="mt-2 flex flex-wrap items-center">
    <CdxButton v-for="type in types" :key="type" class="ml-2" :type="type">
      {{ type }}
    </CdxButton>
  </div>
  <div class="mt-2 flex flex-wrap items-center">
    <CdxButton v-for="type in types" :key="type" class="ml-2" :type="type" plain>
      {{ type }}
    </CdxButton>
  </div>
  <div class="mt-2 flex flex-wrap items-center">
    <CdxButton v-for="type in types" :key="type" class="ml-2" :type="type" round>
      {{ type }}
    </CdxButton>
  </div>
  <div class="mt-2 flex flex-wrap items-center">
    <CdxButton v-for="type in types" :key="type" class="ml-2" :type="type" disabled>
      {{ type }}
    </CdxButton>
  </div>
  <div class="mt-2 flex flex-wrap items-center">
    <CdxButton v-for="type in types" :key="type" class="ml-2" :type="type" plain disabled>
      {{ type }}
    </CdxButton>
  </div>
  <div class="mt-2 flex flex-wrap items-center">
    <CdxButton v-for="type in types" :key="type" class="ml-2" :type="type" plain round disabled>
      {{ type }}
    </CdxButton>
  </div>
</template>
