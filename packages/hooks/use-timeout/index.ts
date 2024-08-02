import { onScopeDispose } from 'vue';

export const useTimeout = () => {
  let timeout: number;

  const clearTimeout = () => window.clearTimeout(timeout);
  const startTimeout = (fn: (...args: any[]) => any, delay: number) => {
    clearTimeout();
    timeout = window.setTimeout(fn, delay);
  };

  onScopeDispose(() => {
    clearTimeout();
  });

  return {
    startTimeout,
    clearTimeout,
  };
};
