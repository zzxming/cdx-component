<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { loadingProps } from './loading';
import { useBem, useLockScroll } from '@cdx-component/hooks';

defineOptions({ name: 'CdxLoading' });
const props = defineProps(loadingProps);

const [, bem] = useBem('loading');

const loadingRef = ref<HTMLElement>();
const currentVisible = ref(props.visible);

const loadingStyle = computed(() => ({
    backgroundColor: props?.background,
}));

watch(
    () => props.visible,
    () => {
        currentVisible.value = props.visible;
    }
);
onMounted(() => {
    useLockScroll(currentVisible, { target: loadingRef.value?.parentElement! });
});
</script>

<template>
    <Transition
        :name="bem.ns('fade')"
        appear
    >
        <div
            ref="loadingRef"
            v-if="currentVisible"
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
</template>
