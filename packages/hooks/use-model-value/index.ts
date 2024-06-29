import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { computed, getCurrentInstance, ref, watch } from 'vue';

export const useModelValue = <T>(props: { modelValue: T }, defaultValue: T) => {
  const { emit } = getCurrentInstance()!;

  const visible = ref(defaultValue);

  const model = computed({
    get() {
      return props.modelValue || visible.value;
    },
    set(value: any) {
      visible.value = value;
      emit(UPDATE_MODEL_EVENT, value);
    },
  });

  watch(
    () => props.modelValue,
    (val) => {
      model.value = val;
    },
    { immediate: true },
  );
  return { model };
};
