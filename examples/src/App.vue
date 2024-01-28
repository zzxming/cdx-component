<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, ref } from 'vue';
import { isNumber } from 'cdx-component';

onMounted(() => {
    console.log(isNumber(2));
});
const v = ref(false);
</script>

<template>
    <header>
        <div
            class="wrapper"
            @click="v = true"
        >
            youdid
        </div>
    </header>
    <CdDrawer
        v-model="v"
        :slide="true"
    >
        <div style="background-color: aqua">content</div>
        <template #swipe>
            <div
                style="width: 200px; height: 200px; background: skyblue"
                @click="v = true"
            >
                swipe
            </div>
        </template>
    </CdDrawer>
</template>
