<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import Monaco from '@vue/repl/monaco-editor';
import { Repl, useStore, useVueImportMap, File } from '@vue/repl';
import setupCode from './template/setup.js?raw';
import mainCode from './template/main.vue?raw';
import appCode from './template/App.vue?raw';

const {
    importMap: builtinImportMap,
    vueVersion,
    productionMode,
} = useVueImportMap({
    vueVersion: '3.3.11',
});

productionMode.value = false;

const setupFile = 'src/setup.js';
const mainFile = 'src/main.vue';
const appFile = 'src/App.vue';

builtinImportMap.value.imports!['cdx-component'] = '/cdx-component/index.js';
const store = useStore(
    {
        builtinImportMap,
        vueVersion,
        files: ref({
            [appFile]: new File(appFile, appCode, false),
            [setupFile]: new File(setupFile, setupCode, true),
            [mainFile]: new File(mainFile, mainCode, true),
        }),
        mainFile: ref(mainFile),
        // activeFilename: ref(appFile),
    },
    location.hash,
);
store.files[setupFile].hidden = true;
store.files[mainFile].hidden = true;
store.init();
store.setActive(appFile);

console.log(store);
console.log(store.files);
watchEffect(() => history.replaceState({}, '', store.serialize()));
</script>

<template>
    <Repl
        :store="store"
        show-compile-output
        auto-resize
        :clear-console="false"
        :editor="Monaco"
        :theme="'light'"
    ></Repl>
</template>

<style lang="less" scoped></style>
