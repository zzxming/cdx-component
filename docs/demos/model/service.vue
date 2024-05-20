<template>
    <button @click="startModel">open model</button>
    <button @click="startFullscreenModel">open fullscreen model</button>
    <div
        ref="divRef"
        style="position: relative; height: 200px"
    ></div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { CdxModel } from 'cdx-component';

const divRef = ref();

const startModel = () => {
    const { close } = CdxModel.service({
        target: divRef.value,
        body: 'content',
        fullscreen: false,
    });
};
const startFullscreenModel = () => {
    const { close } = CdxModel.service({
        body: 'content',
        header: h('div', 'header'),
        footer: h('div', 'footer'),
    });
};
</script>
