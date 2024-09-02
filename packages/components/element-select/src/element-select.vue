<script setup lang="ts">
import { computed, nextTick, provide, ref, toRefs } from 'vue';
import { pick } from '@cdx-component/utils';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { useBem } from '@cdx-component/hooks';
import type { ElementSelectValueType } from './element-select';
import { elementSelectEmits, elementSelectProps } from './element-select';
import { selectContextKey } from './constants';

defineOptions({ name: 'CdxElementSelect' });
const props = defineProps(elementSelectProps);
const emits = defineEmits(elementSelectEmits);

const [, bem] = useBem('element-select');

const isUnselect = false;

const selectGroupRef = ref();
const selecting = ref(false);

const changeEvent = async (value: ElementSelectValueType[]) => {
  emits(UPDATE_MODEL_EVENT, value);
  await nextTick();
  emits(CHANGE_EVENT, value);
};

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
    :is="tag"
    ref="selectGroupRef"
    :class="className"
  >
    <slot />
  </component>
</template>
