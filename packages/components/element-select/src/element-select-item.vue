<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { selectContextKey } from './constants';
import { ElementSelectItemProps, elementSelectItemEmits } from './element-select-item';
import { ElementSelectValueType } from './element-select';

const props = withDefaults(defineProps<ElementSelectItemProps>(), {
    checked: false,
    disabled: false,
    trueValue: true,
    falseValue: false,
});
const emits = defineEmits(elementSelectItemEmits);
const selectContext = inject(selectContextKey, undefined);

const curStatus = ref<unknown>(false);
const isChecked = computed(() =>
    selectContext
        ? (model.value as ElementSelectValueType[]).includes(props.trueValue)
        : model.value === props.trueValue
);
const isDisabled = computed(() => props.disabled || selectContext?.disabled?.value);
const isMaxGroup = computed(
    () =>
        selectContext &&
        selectContext.max?.value !== undefined &&
        selectContext.modelValue.value.length >= selectContext.max.value
);

const model = computed({
    get() {
        return selectContext ? selectContext.modelValue.value : props.modelValue ?? curStatus.value;
    },
    set(val) {
        if (selectContext) {
            const value = val as ElementSelectValueType[];
            if (isMaxGroup.value && value.length > selectContext.modelValue.value.length) return;
            selectContext.modelValue.value = value;
        } else {
            const value = val as ElementSelectValueType;
            emits('update:modelValue', value);
            curStatus.value = value;
        }
    },
});
const setValue = (status: boolean) => {
    if (isDisabled.value) return;
    const { trueValue, falseValue } = props;
    if (selectContext) {
        const value = selectContext.modelValue.value;
        if (status) {
            model.value = value.concat(trueValue);
        } else {
            const i = value.indexOf(trueValue);
            i !== -1 && (model.value = value.slice(0, i).concat(value.slice(i + 1)));
        }
    } else {
        model.value = status ? trueValue : falseValue;
    }
    emits('change', status ? trueValue : falseValue);
};
const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emits('change', target.checked ? props.trueValue : props.falseValue);
};
const handleUp = () => {
    selectContext && (selectContext.selecting.value = false);
    document.removeEventListener('mouseup', handleUp);
};
const handleDown = () => {
    if (isDisabled.value) return;
    const status = isChecked.value;
    setValue(!status);
    if (!selectContext) return;
    selectContext.selecting.value = true;
    selectContext.isUnselect = status;
    document.addEventListener('mouseup', handleUp);
};
const handleEnter = () => {
    if (!selectContext || isDisabled.value) return;
    if (selectContext.selecting.value && isChecked.value !== !selectContext.isUnselect) {
        setValue(!selectContext.isUnselect);
    }
};

const className = computed(() => [
    'element_select_item',
    isChecked.value ? 'checked' : '',
    isDisabled.value ? 'disabled' : '',
]);
</script>

<template>
    <label
        :class="className"
        @mousedown="handleDown"
        @mouseenter="handleEnter"
        @click.prevent
    >
        <slot></slot>

        <div
            class="element_select_item-mask"
            v-if="isChecked || isDisabled"
        >
            <slot name="mask"></slot>
        </div>
        <input
            class="element_select-input"
            v-model="model"
            type="checkbox"
            :value="trueValue"
            :true-value="trueValue"
            :false-value="falseValue"
            :disabled="isDisabled"
            @change="handleChange"
        />
    </label>
</template>
