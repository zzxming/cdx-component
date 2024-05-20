<template>
    <div style="position: relative; height: 200px">
        <CdxOverlay v-model="show"></CdxOverlay>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const show = ref(true);
</script>
