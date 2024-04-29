<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { loadingProps } from './loading';
import { useBem, useLockScroll, useZIndex } from '@cdx-component/hooks';

defineOptions({ name: 'CdxLoading' });
const props = defineProps(loadingProps);

const [, bem] = useBem('loading');
const { currentZIndex, nextZIndex } = useZIndex();

const loadingRef = ref<HTMLElement>();

const loadingStyle = computed(() => ({
    backgroundColor: props?.background,
    zIndex: props.fullscreen ? currentZIndex.value : undefined,
}));
const isLock = computed(() => props.lock && props.visible);

watch(
    () => [props.visible, props.fullscreen],
    () => {
        if (props.fullscreen && props.visible) {
            nextZIndex();
        }
    },
    {
        immediate: true,
    },
);

onMounted(() => {
    useLockScroll(isLock, { target: loadingRef.value?.parentElement! });
});
</script>

<template>
    <Teleport
        :to="target"
        :disabled="!target"
    >
        <Transition
            :name="bem.ns('fade')"
            appear
        >
            <div
                ref="loadingRef"
                v-if="visible"
                :class="[bem.be('mask'), fullscreen && bem.bm('fullscreen')]"
                :style="loadingStyle"
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
    </Teleport>
</template>
