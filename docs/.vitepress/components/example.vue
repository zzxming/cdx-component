<script lang="ts" setup>
import { useDocBem } from '../composables';

defineProps({
    file: {
        type: String,
        required: true,
    },
    demo: {
        type: Object,
        required: true,
    },
});

const [, bem] = useDocBem('example');
</script>

<template>
    <div :class="bem.be('showcase')">
        <ClientOnly>
            <component
                :is="demo"
                v-if="demo"
                v-bind="$attrs"
            />
        </ClientOnly>
    </div>
</template>

<style lang="less" scoped>
.doc-example {
    &__showcase {
        @apply relative p-6;
    }
}
</style>
<style lang="less">
.doc-example {
    &__showcase {
        .cdx {
            &-loading__mask {
                z-index: 9;
            }
        }
    }
}
</style>
