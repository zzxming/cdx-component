<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
const v = ref([]);
watch(v, () => {
    console.log(v.value);
});

const h = ref(false);
</script>

<template>
    v-loading="true"
    <div
        v-loading="!h"
        style="width: 200px; height: 200px"
    ></div>
    <CdxElementSelect v-model="v">
        <CdxElementSelectItem
            v-for="info in 20"
            :trueValue="info"
        >
            <div class="item">{{ info }}</div>
        </CdxElementSelectItem>
    </CdxElementSelect>

    <CdxDrawer
        fullscreen
        v-model="h"
    >
        content
        <template #swipe>
            <div
                @click="h = !h"
                style="height: 200px; border: 1px solid"
            >
                class
            </div>
        </template>
    </CdxDrawer>
</template>

<style>
.item {
    margin: 4px;
    padding: 4px;
}
</style>
