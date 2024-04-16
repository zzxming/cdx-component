<template>
    <div class="vp-raw">
        <ClientOnly>
            <div class="example">
                <Example
                    :file="src"
                    :demo="formatPathDemos[src]"
                />
            </div>
        </ClientOnly>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    src: string;
    demos: object;
    rawSource: string;
}>();
const code = computed(() => decodeURIComponent(props.rawSource));
const formatPathDemos = computed(() => {
    const demos = {};
    Object.keys(props.demos).forEach((key) => {
        demos[key.replace('/demos/', '').replace('.vue', '')] = props.demos[key].default;
    });
    return demos;
});
</script>

<style lang="less" scoped>
.example {
    @apply border border-stone-200 rounded;
}
</style>
