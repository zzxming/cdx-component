<script lang="ts" setup>
import { ref, computed } from 'vue';

const props = defineProps<{
    source: string;
}>();

const isExpand = ref(false);

const exampleCodeText = computed(() => (isExpand.value ? '隐藏源代码' : '查看源代码'));
const exampleCodeStyle = computed(() => ({
    height: isExpand.value ? 'auto' : '0',
}));
const code = computed(() => decodeURIComponent(props.source));
</script>

<template>
    <div class="example-source">
        <div
            class="example-source-wrapper"
            :style="exampleCodeStyle"
        >
            <div
                class="example-source-code language-vue"
                v-html="code"
            />
        </div>
        <div
            class="example-source-expand"
            @click="isExpand = !isExpand"
        >
            {{ exampleCodeText }}
        </div>
    </div>
</template>

<style lang="less" scoped>
.example {
    &-source {
        &-wrapper {
            @apply overflow-hidden;
        }
        &-expand {
            @apply sticky bottom-0 z-10 w-full flex items-center justify-center p-2 
                   border-t cursor-pointer text-gray-500 hover:text-blue-500 bg-white rounded-b-lg;
        }
    }
}
</style>
