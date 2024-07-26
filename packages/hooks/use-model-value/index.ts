import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { isUndefined } from '@cdx-component/utils';
import { computed, getCurrentInstance, ref, watch } from 'vue';

export const useModelValue = <T>(props: { modelValue: T }, defaultValue: T) => {
  const { emit } = getCurrentInstance()!;

  const internalValue = ref(defaultValue);

  const model = computed({
    get() {
      return props.modelValue || internalValue.value;
    },
    set(value: any) {
      internalValue.value = value;
      emit(UPDATE_MODEL_EVENT, value);
    },
  });

  watch(
    () => props.modelValue,
    (val) => {
      model.value = isUndefined(val) ? defaultValue : val;
    },
    { immediate: true },
  );

  return { model };
};
