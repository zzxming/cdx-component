<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, ref, watch } from 'vue';

const v = ref([]);
watch(v, () => {
    console.log(v.value);
});
</script>

<template>
    <header>
        <div class="wrapper">youdid</div>
    </header>

    <CdElementSelect v-model="v">
        <CdElementSelectItem
            v-for="info in 20"
            :trueValue="info"
        >
            <div class="item">{{ info }}</div>
        </CdElementSelectItem>
    </CdElementSelect>
</template>

<style>
.item {
    margin: 4px;
    padding: 4px;
}
</style>
