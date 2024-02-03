<script setup lang="ts">
import { LoadingProps } from './loading';

const props = defineProps<LoadingProps>();
</script>

<template>
    <div class="loading-mask">
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
