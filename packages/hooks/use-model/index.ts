import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { ref, computed, getCurrentInstance, onMounted, UnwrapRef } from 'vue';
export const useModel = <T>(props: Object & { modelValue: T }, defaultValue: T) => {
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
    return { model };
};
