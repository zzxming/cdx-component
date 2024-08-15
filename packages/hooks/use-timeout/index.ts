import type { AnyFunction } from '@cdx-component/utils';
import { tryOnScope } from '@cdx-component/utils';
import { onScopeDispose } from 'vue';

export const useTimeout = () => {
  let timeout: number;

  const clearTimeout = () => window.clearTimeout(timeout);
  const startTimeout = (fn: AnyFunction, delay: number) => {
    clearTimeout();
    timeout = window.setTimeout(fn, delay);
  };

  tryOnScope(onScopeDispose, () => {
    clearTimeout();
  });

  return {
    startTimeout,
    clearTimeout,
  };
};
