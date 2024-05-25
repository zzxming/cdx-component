<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import Monaco from '@vue/repl/monaco-editor';
import { Repl, useStore, useVueImportMap, File, compileFile } from '@vue/repl';
import setupCode from './template/setup.js?raw';
import mainCode from './template/main.vue?raw';
import welcomeSFCCode from './template/welcome.vue?raw';
import newSFCCode from './template/newFile.vue?raw';

const query = new URLSearchParams(location.search);
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

const files = ref<Record<string, File>>({
    [appFile]: new File(appFile, welcomeSFCCode, false),
    [setupFile]: new File(setupFile, setupCode, true),
    [mainFile]: new File(mainFile, mainCode, true),
});

const store = useStore(
    {
        showOutput: ref(query.has('showOutput')),
        builtinImportMap,
        vueVersion,
        files,
        template: ref({
            welcomeSFC: welcomeSFCCode,
            newSFC: newSFCCode,
        }),
        // mainFile: ref(mainFile),
        // activeFilename: ref(appFile),
    },
    location.hash,
);
// 在 option 中设置会导致 files 里的 compiler 是空而无法解析到 iframe 中
for (const key in files.value) {
    compileFile(store, files.value[key]);
}
store.mainFile = mainFile;
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
