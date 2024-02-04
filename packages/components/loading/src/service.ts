import { createApp } from 'vue';
import { useZIndex } from '@cdx-component/hooks';
import LoadingVue from './loading.vue';
import { LoadingInstance, LoadingOptions } from './types';

export const createLoadingInstance = ({ text, fullscreen }: LoadingOptions) => {
    const loadingInstance = createApp(LoadingVue, { text, fullscreen });
    const vm = loadingInstance.mount(document.createElement('div'));

    const close = () => {
        if (vm) {
            vm.$el.remove();
            loadingInstance.unmount();
        }
    };

    return {
        instance: loadingInstance,
        vm,
        close,
    };
};

let fullscreenInstance: LoadingInstance | undefined = undefined;
export const vLoading = (options: LoadingOptions) => {
    const { target = document.body } = options;
    if (options.fullscreen && fullscreenInstance) return fullscreenInstance;
    const instance = createLoadingInstance(options);
    if (options.fullscreen) {
        instance.vm.$el.style.zIndex = useZIndex().nextZIndex();
        const originClose = instance.close;
        instance.close = () => {
            originClose();
            fullscreenInstance = undefined;
        };
    }
    target?.appendChild(instance.vm.$el);
    if (options?.fullscreen) {
        fullscreenInstance = instance;
    }
    return instance;
};
