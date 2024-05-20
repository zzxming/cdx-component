<template>
    <CdxTextHighlight
        :content="content"
        :texts="texts"
        :ignoreCase="false"
    >
        <template #highlight="{ text }">
            <span style="cursor: pointer; color: red">{{ text }}</span>
        </template>
        <template #default="{ text }">
            <span style="color: blue">{{ text }}</span>
        </template>
    </CdxTextHighlight>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
const content = ref(
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt non architecto nulla repellendus libero vero hic accusamus, suscipit itaque, dolorum placeat nostrum laboriosam vel sapiente impedit ipsa saepe voluptatem autem?',
);
const texts = computed(() => {
    const words = content.value.split(' ');
    return new Array(5).fill('').map(() => words[Math.floor(Math.random() * words.length)]);
});
</script>
