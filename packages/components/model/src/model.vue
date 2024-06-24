<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from 'vue';
import { CdxOverlay } from '@cdx-component/components';
import { useBem, useZIndex, useModelValue } from '@cdx-component/hooks';
import { modelEmits, modelProps } from './model';

defineOptions({ name: 'CdxModel' });
const props = defineProps(modelProps);
const emits = defineEmits(modelEmits);

const [, bem] = useBem('model');
const { model } = useModelValue(props, false);
const { nextZIndex } = useZIndex();

const contentRended = ref(model.value);
const zIndex = ref(nextZIndex());

const disabledTeleport = computed(() => !props.fullscreen);
const contentStyle = computed(() => {
    const modelStyle: CSSProperties = {};
    if (props.width) {
        modelStyle[`--${bem.b()}-width`] = props.width;
    }
    return modelStyle;
});
const overlayStyle = computed(() => ({
    zIndex: disabledTeleport.value ? 0 : zIndex.value,
}));

const close = () => {
    if (!props.maskClose) return;
    model.value = false;
};
const handleTransitionEnter = () => {
    zIndex.value = nextZIndex();
    contentRended.value = true;
}
const handleTransitionAfterLeave = () => {
    props.destroyOnClose && (contentRended.value = false);
    emits('close');
}
</script>

<template>
    <Teleport
        to="body"
        :disabled="disabledTeleport"
    >
        <Transition
            :name="bem.ns('fade')"
            appear
            @enter="handleTransitionEnter"
            @after-leave="handleTransitionAfterLeave"
        >
            <CdxOverlay
                v-model="model"
                @click="close"
                :fullscreen="fullscreen"
                :style="overlayStyle"
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
    </Teleport>
</template>
