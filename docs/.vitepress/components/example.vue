<script lang="ts" setup>
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
</script>

<template>
    <div class="example-showcase">
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
.example {
    &-showcase {
        @apply relative p-6;
    }
}
</style>
<style lang="less">
.example {
    &-showcase {
        .cdx {
            &-loading__mask {
                z-index: 9;
            }
        }
    }
}
</style>
