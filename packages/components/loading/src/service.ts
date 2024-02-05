import { createApp, defineComponent, h, reactive } from 'vue';
import { useZIndex } from '@cdx-component/hooks';
import LoadingVue from './loading.vue';
import { LoadingInstance, LoadingOptions } from './types';

let unmountTimer = window.setTimeout(() => {}, 0);
export const createLoadingInstance = ({ text, fullscreen }: LoadingOptions) => {
    const data = reactive({
        visible: false,
    });

    const load = defineComponent({
        name: 'CdxLoading',
        setup(props) {
            return () => h(LoadingVue, { ...props, visible: data.visible });
        },
    });
    const loadingInstance = createApp(load, { text, fullscreen });
    const vm = loadingInstance.mount(document.createElement('div'));

    const close = () => {
        clearTimeout(unmountTimer);
        unmountTimer = window.setTimeout(() => {
            if (vm) {
                vm.$el.remove();
                loadingInstance.unmount();
            }
        }, 3000);
        data.visible = false;
    };
    data.visible = true;

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
            target.classList.remove('relative');
            fullscreenInstance = undefined;
        };
    }
    target?.appendChild(instance.vm.$el);
    target.classList.add('relative');
    if (options?.fullscreen) {
        fullscreenInstance = instance;
    }
    return instance;
};
