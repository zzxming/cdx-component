<script setup lang="ts">
import { ref, watch } from 'vue';
import { loadingProps } from './loading';
import { useBem } from '@cdx-component/hooks';

const props = defineProps(loadingProps);

const [, bem] = useBem('loading');

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
        :name="bem.ns('fade')"
        appear
    >
        <div
            v-if="currentVisible"
            :class="[bem.be('mask'), fullscreen && bem.bm('fullscreen')]"
        >
            <div :class="bem.be('tip')">
                <svg
                    :class="bem.be('spinner')"
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
                    :class="bem.be('text')"
                >
                    {{ text }}
                </span>
            </div>
        </div>
    </Transition>
</template>
