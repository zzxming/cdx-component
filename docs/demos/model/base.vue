<template>
    <div style="position: relative; height: 200px">
        <button @click="show = true">open model</button>
        <CdxModel v-model="show">
            <template #header>
                <div>model header</div>
            </template>
            <div>click outside to close</div>
            <template #footer>
                <div>model footer</div>
            </template>
        </CdxModel>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(true);
</script>
