<script lang="ts" setup>
import { ref } from 'vue';

const value = ref([]);
</script>

<template>
    <CdxElementSelect
        v-model="value"
        :max="10"
    >
        <CdxElementSelectItem
            class="item"
            v-for="i in 40"
            :trueValue="i"
        >
            {{ i }}
        </CdxElementSelectItem>
    </CdxElementSelect>
</template>

<style scoped>
.item {
    padding: 8px;
}
</style>
