import type { InjectionKey, Ref, ToRefs, WritableComputedRef } from 'vue';
import { ElementSelectProps, ElementSelectValueType } from './element-select';

export type ElementSelectContext = {
    modelValue: WritableComputedRef<ElementSelectValueType[]>;
    changeEvent: (value: ElementSelectValueType[]) => void;
    selecting: Ref<boolean>;
    isUnselect: boolean;
    selectGroupRef: Ref<HTMLElement | null>;
} & ToRefs<Pick<ElementSelectProps, 'max' | 'disabled'>>;

export const selectContextKey: InjectionKey<ElementSelectContext> = Symbol('selectContextKey');
