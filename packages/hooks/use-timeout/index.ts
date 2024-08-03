import { tryOnScopeDispose } from '@cdx-component/utils';

export const useTimeout = () => {
  let timeout: number;

  const clearTimeout = () => window.clearTimeout(timeout);
  const startTimeout = (fn: (...args: any[]) => any, delay: number) => {
    clearTimeout();
    timeout = window.setTimeout(fn, delay);
  };

  tryOnScopeDispose(() => {
    clearTimeout();
  });

  return {
    startTimeout,
    clearTimeout,
  };
};
