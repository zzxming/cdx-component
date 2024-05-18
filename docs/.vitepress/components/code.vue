<script lang="ts" setup>
import { CdxCollapseTransition } from 'cdx-component';
import { ref, computed } from 'vue';

const props = defineProps<{
    source: string;
}>();

const isExpand = ref(false);

const exampleCodeText = computed(() => (isExpand.value ? '隐藏源代码' : '查看源代码'));
const code = computed(() => decodeURIComponent(props.source));
</script>

<template>
    <div class="example-source">
        <CdxCollapseTransition>
            <div
                class="example-source-wrapper"
                v-show="isExpand"
            >
                <div
                    class="example-source-code language-vue"
                    v-html="code"
                />
            </div>
        </CdxCollapseTransition>
        <div
            class="example-source-expand"
            @click="isExpand = !isExpand"
        >
            {{ exampleCodeText }}
        </div>
    </div>
</template>

<style lang="less">
.example {
    &-source {
        &-wrapper {
            @apply overflow-hidden;
        }
        &-expand {
            background-color: var(--vp-c-bg);
            @apply sticky bottom-0 z-10 w-full flex items-center justify-center p-2 
                   border-t cursor-pointer text-gray-500 hover:text-blue-500 rounded-b-lg;
        }
    }
}
</style>
