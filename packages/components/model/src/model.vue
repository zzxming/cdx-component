<script setup lang="ts">
import { computed, ref, watch, type CSSProperties, onMounted } from 'vue';
import { CdxOverlay } from '@cdx-component/components';
import { useBem, useZIndex, useModelValue } from '@cdx-component/hooks';
import { modelEmits, modelProps } from './model';

const props = defineProps(modelProps);
const emits = defineEmits(modelEmits);

const [, bem] = useBem('model');
const { model } = useModelValue(props, false);
const { nextZIndex } = useZIndex();

const contentRended = ref(false);
const zIndex = ref(nextZIndex());

const contentStyle = computed(() => {
    const modelStyle: CSSProperties = {};
    if (props.width) {
        modelStyle[`--${bem.b()}-width`] = props.width;
    }
    return modelStyle;
});

watch(
    () => props.modelValue,
    () => {
        if (props.destroyOnClose && !props.modelValue) {
            contentRended.value = false;
        } else {
            contentRended.value = true;
        }
    },
    { immediate: true }
);
watch(model, () => {
    if (model.value) {
        zIndex.value = nextZIndex();
    }
});

const close = () => {
    if (!props.maskClose) return;
    model.value = false;
};
</script>

<template>
    <Transition
        :name="bem.bs('fade')"
        appear
    >
        <CdxOverlay
            v-show="model"
            @click="close"
            :fullscreen="fullscreen"
            :style="{ zIndex }"
        >
            <div
                v-if="contentRended"
                :class="bem.b()"
                :style="contentStyle"
            >
                <div :class="bem.be('content')">
                    <div
                        v-if="$slots.header"
                        :class="bem.be('header')"
                    >
                        <slot name="header"></slot>
                    </div>
                    <div :class="bem.be('body')">
                        <slot></slot>
                    </div>
                    <div
                        v-if="$slots.footer"
                        :class="bem.be('footer')"
                    >
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </CdxOverlay>
    </Transition>
</template>
