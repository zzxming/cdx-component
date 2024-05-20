<template>
    <CdxElementSelectItem
        v-model="value"
        true-value="success"
        false-value="fail"
    >
        {{ value }}
    </CdxElementSelectItem>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const value = ref('fail');
</script>
