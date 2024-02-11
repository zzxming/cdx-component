import { createApp, defineComponent, h, reactive } from 'vue';
import { useBem, useZIndex } from '@cdx-component/hooks';
import LoadingVue from './loading.vue';
import { LoadingInstance, LoadingOptions } from './types';

let unmountTimer = setTimeout(() => {}, 0);
export const createLoadingInstance = ({ text, fullscreen }: Pick<LoadingOptions, 'fullscreen' | 'text'>) => {
    const data = reactive({
        visible: true,
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
        unmountTimer = setTimeout(() => {
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
    const [_, bem] = useBem('relative');
    const { target = document.body, ...props } = options;
    if (options.fullscreen && fullscreenInstance) return fullscreenInstance;
    const instance = createLoadingInstance(props);
    if (options.fullscreen) {
        instance.vm.$el.style.zIndex = useZIndex().nextZIndex();
        const originClose = instance.close;
        instance.close = () => {
            originClose();
            target.classList.remove(bem.b());
            fullscreenInstance = undefined;
        };
    }
    target.appendChild(instance.vm.$el);
    target.classList.add(bem.b());
    if (options?.fullscreen) {
        fullscreenInstance = instance;
    }
    return instance;
};
