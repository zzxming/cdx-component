import { provide } from 'vue';
import type { InjectionKey, Ref } from 'vue';

export interface InjectForwardRef {
  setForwardRef: <T>(el: T) => void;
};

export const FORWARD_PROVIDE_KEY: InjectionKey<InjectForwardRef> = Symbol('forwardRef');
export const useForwardRef = <T>(forwardRef: Ref<T>) => {
  const setForwardRef = (el: T) => {
    forwardRef.value = el;
  };

  provide(FORWARD_PROVIDE_KEY, {
    setForwardRef,
  } as InjectForwardRef);
};
