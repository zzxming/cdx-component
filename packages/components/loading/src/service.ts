import { createApp, defineComponent, h, reactive } from 'vue';
import { useBem } from '@cdx-component/hooks';
import { isString } from '@cdx-component/utils';
import LoadingVue from './loading.vue';
import type { LoadingInstance, ServiceOptions } from './types';

let unmountTimer = setTimeout(() => {}, 0);
export const createLoadingInstance = (props: ServiceOptions) => {
  const data = reactive({
    visible: true,
  });

  const load = defineComponent({
    name: 'CdxLoading',
    setup(props) {
      return () =>
        h(LoadingVue, {
          ...props,
          visible: data.visible,
        });
    },
  });
  const loadingInstance = createApp(load, props);
  const vm = loadingInstance.mount(document.createElement('div'));

  const close = () => {
    clearTimeout(unmountTimer);
    unmountTimer = setTimeout(() => {
      if (vm) {
        vm.$el.remove();
        loadingInstance.unmount();
      }
    }, 300);
    data.visible = false;
  };

  return {
    instance: loadingInstance,
    vm,
    close,
  };
};

const resolveOptions = (options: ServiceOptions = {}) => {
  const target: HTMLElement = isString(options.target) ? document.querySelector(options.target) ?? document.body : options.target || document.body;
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
  const [, relativeBem] = useBem('relative');

  const resolvedOps = resolveOptions(options);
  if (resolvedOps.fullscreen && fullscreenInstance) return fullscreenInstance;
  const instance = createLoadingInstance(resolvedOps);

  if (resolvedOps.fullscreen) {
    fullscreenInstance = instance;
  }
  const originClose = instance.close;
  instance.close = () => {
    originClose();
    resolvedOps.target.classList.remove(relativeBem.b());
    if (resolvedOps.fullscreen) {
      fullscreenInstance = undefined;
    }
  };

  resolvedOps.target.classList.add(relativeBem.b());
  resolvedOps.target.appendChild(instance.vm.$el);
  return instance;
};
