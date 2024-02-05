<script setup lang="ts">
import { ref, watch } from 'vue';
import { loadingProps } from './loading';

const props = defineProps(loadingProps);
const currentVisible = ref(props.visible);

watch(
    () => props.visible,
    () => {
        currentVisible.value = props.visible;
    }
);
</script>

<template>
    <Transition
        name="fade"
        appear
    >
        <div
            v-if="currentVisible"
            :class="['loading-mask', fullscreen && 'is-fullscreen']"
        >
            <div class="loading-tip">
                <svg
                    class="loading-spinner"
                    viewBox="0 0 50 50"
                >
                    <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                    ></circle>
                </svg>
                <span
                    v-if="text"
                    class="loading-text"
                >
                    {{ text }}
                </span>
            </div>
        </div>
    </Transition>
</template>
