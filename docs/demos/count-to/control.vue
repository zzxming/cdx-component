<template>
    <button @click="restart">restart</button>
    <button @click="start">start</button>
    <button @click="stop">stop</button>
    <br />
    <CdxCountTo
        ref="countToRef"
        :auto-start="false"
        :start-value="startValue"
        :end-value="endValue"
        :duration="duration"
    ></CdxCountTo>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const countToRef = ref();
const startValue = ref(0);
const endValue = ref(3000);
const duration = ref(5000);

const restart = () => {
    countToRef.value.restart();
};
const start = () => {
    countToRef.value.startCount();
};
const stop = () => {
    countToRef.value.stopCount();
};
</script>

<style>
button {
    padding: 4px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
