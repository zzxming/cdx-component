<script setup lang="ts">
import { computed, nextTick, provide, ref, toRefs } from 'vue';
import { selectContextKey } from './constants';
import { elementSelectProps, ElementSelectValueType, elementSelectEmits } from './element-select';
import { pick } from 'lodash-unified';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { useBem } from '@cdx-component/hooks';

defineOptions({ name: 'CdxElementSelect' });
const props = defineProps(elementSelectProps);
const emits = defineEmits(elementSelectEmits);

const [, bem] = useBem('element-select');

const selectGroupRef = ref();
const isUnselect = false;
const selecting = ref(false);

const modelValue = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        changeEvent(val);
    },
});
const className = computed(() => {
    const classNames = [bem.b()];
    if (selecting.value) classNames.push(bem.bm('selecting'));
    return classNames;
});

const changeEvent = async (value: ElementSelectValueType[]) => {
    emits(UPDATE_MODEL_EVENT, value);
    await nextTick();
    emits(CHANGE_EVENT, value);
};

provide(selectContextKey, {
    ...pick(toRefs(props), ['max', 'disabled']),
    modelValue,
    changeEvent,
    selecting,
    isUnselect,
    selectGroupRef,
});
</script>

<template>
    <component
        ref="selectGroupRef"
        :is="tag"
        :class="className"
    >
        <slot></slot>
    </component>
</template>
