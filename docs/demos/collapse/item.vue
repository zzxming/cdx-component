<template>
    <CdxCollapseItem
        title="item"
        v-model:expend="active"
    >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, architecto non? Atque qui, beatae tenetur
        quis iure ullam, recusandae dolores quod voluptas fuga error. Optio molestiae inventore nulla ipsam iure!
    </CdxCollapseItem>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const active = ref(true);
</script>
