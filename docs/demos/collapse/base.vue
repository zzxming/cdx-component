<template>
    <CdxCollapse v-model="activeName">
        <CdxCollapseItem
            v-for="i in 3"
            :name="i"
            :title="`item ${i}`"
        >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, architecto non? Atque qui, beatae
            tenetur quis iure ullam, recusandae dolores quod voluptas fuga error. Optio molestiae inventore nulla ipsam
            iure!
        </CdxCollapseItem>
    </CdxCollapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const activeName = ref(['1']);
</script>
