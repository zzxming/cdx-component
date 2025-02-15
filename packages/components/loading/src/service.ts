import type { LoadingInstance, ServiceOptions } from './types';
import { useBem } from '@cdx-component/hooks';
import { isString } from '@cdx-component/utils';
import { createApp, defineComponent, h, ref, Teleport } from 'vue';
import LoadingVue from './loading.vue';

let unmountTimer = setTimeout(() => {}, 0);
export const createLoadingInstance = (props: Omit<ServiceOptions, 'target'>, target: HTMLElement | string = 'body') => {
  const data = ref(true);
  const [, relativeBem] = useBem('relative');
  const targetDom = isString(target) ? document.querySelector(target)! : target;
  targetDom.classList.add(relativeBem.b());

  const loadingInstance = createApp(
    defineComponent({
      name: 'CdxLoading',
      setup() {
        return () => h(Teleport, {
          to: target,
        }, [
          h(LoadingVue, {
            ...props,
            visible: data.value,
          }),
        ]);
      },
    }),
  );
  const vm = loadingInstance.mount(document.createElement('div'));

  const close = () => {
    clearTimeout(unmountTimer);
    unmountTimer = setTimeout(() => {
      if (vm) {
        targetDom.classList.remove(relativeBem.b());
        vm.$el.remove();
        loadingInstance.unmount();
      }
    }, 300);
    data.value = false;
  };

  return {
    instance: loadingInstance,
    vm,
    close,
  };
};

const resolveOptions = (options: ServiceOptions = {}) => {
  const target: HTMLElement = (isString(options.target) ? document.querySelector(options.target) : options.target) || document.body;
  return {
    text: options.text || '',
    background: options.background || '',
    fullscreen: target === document.body && (options.fullscreen ?? true),
    lock: options.lock ?? true,
    target,
  };
};

let fullscreenInstance: LoadingInstance | undefined;
export const vLoading = (options?: ServiceOptions) => {
  const { target, ...resolvedOps } = resolveOptions(options);
  if (resolvedOps.fullscreen && fullscreenInstance) return fullscreenInstance;
  const instance = createLoadingInstance(resolvedOps, target);

  if (resolvedOps.fullscreen) {
    fullscreenInstance = instance;
  }
  const originClose = instance.close;
  instance.close = () => {
    originClose();
    if (resolvedOps.fullscreen) {
      fullscreenInstance = undefined;
    }
  };

  return instance;
};
