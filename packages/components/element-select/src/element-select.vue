<script setup lang="ts">
import { computed, nextTick, provide, ref, toRefs } from 'vue';
import { selectContextKey } from './constants';
import { elementSelectProps, ElementSelectValueType, elementSelectEmits } from './element-select';
import { pick } from 'lodash-unified';

const props = defineProps(elementSelectProps);
const emits = defineEmits(elementSelectEmits);

const changeEvent = async (value: ElementSelectValueType[]) => {
    emits('update:modelValue', value);
    await nextTick();
    emits('change', value);
};
const modelValue = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        changeEvent(val);
    },
});
const selectGroupRef = ref();
const isUnselect = false;
const selecting = ref(false);
const className = computed(() => {
    const classNames = ['element_select'];
    if (selecting.value) classNames.push('selecting');
    return classNames;
});

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
