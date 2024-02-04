<script setup lang="ts">
import { loadingProps } from './loading';

const props = defineProps(loadingProps);
</script>

<template>
    <div :class="['loading-mask', fullscreen && 'is-fullscreen']">
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
</template>
