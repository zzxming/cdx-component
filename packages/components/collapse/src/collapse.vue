<script setup lang="ts">
import { ref } from 'vue';
import { collapseProps, collapseEmits, CollapseModelValueType } from './collapse';
import { collapseContextKey } from './constants';
import { useBem } from '@cdx-component/hooks';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { provide } from 'vue';

defineOptions({ name: 'CdxCollapse' });
const props = defineProps(collapseProps);
const emits = defineEmits(collapseEmits);

const [, bem] = useBem('collapse');

const activeNames = ref(props.modelValue);

const setActiveNames = (value: CollapseModelValueType[]) => {
    activeNames.value = value;
    emits(UPDATE_MODEL_EVENT, value);
    emits(CHANGE_EVENT, value);
};

const handleItemClick = (name: CollapseModelValueType) => {
    const _activeNames = [...activeNames.value];
    const index = _activeNames.indexOf(name);

    if (index > -1) {
        _activeNames.splice(index, 1);
    } else {
        _activeNames.push(name);
    }
    setActiveNames(_activeNames);
};

provide(collapseContextKey, {
    activeNames,
    handleItemClick,
});
</script>

<template>
    <div :class="bem.b()">
        <slot></slot>
    </div>
</template>
