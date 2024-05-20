<template>
    <CdxTextEllipsis
        v-model="show"
        :content="content"
        :lines="1"
        ellipsisText="..."
        expandText="展开"
        collapseText="收起"
    >
    </CdxTextEllipsis>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const show = ref(false);
const content = ref(
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt non architecto nulla repellendus libero vero hic accusamus, suscipit itaque, dolorum placeat nostrum laboriosam vel sapiente impedit ipsa saepe voluptatem autem?',
);
</script>
