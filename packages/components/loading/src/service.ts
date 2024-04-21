import { createApp, defineComponent, h, reactive } from 'vue';
import { useBem, useZIndex } from '@cdx-component/hooks';
import LoadingVue from './loading.vue';
import { LoadingInstance, LoadingOptions } from './types';

let unmountTimer = setTimeout(() => {}, 0);
export const createLoadingInstance = (props: Omit<LoadingOptions, 'target' | 'visible'>) => {
    const data = reactive({
        visible: true,
    });

    const load = defineComponent({
        name: 'CdxLoading',
        setup(props) {
            return () => h(LoadingVue, { ...props, visible: data.visible });
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
export const vLoading = (options?: LoadingOptions) => {
    const [, relativeBem] = useBem('relative');
    const [, scrollBem] = useBem('scroll');
    const { target = document.body, lock = true, ...props } = options || {};
    if (props.fullscreen && fullscreenInstance) return fullscreenInstance;
    const instance = createLoadingInstance(props);

    if (props.fullscreen) {
        instance.vm.$el.style.zIndex = useZIndex().nextZIndex();
        fullscreenInstance = instance;
    }
    const originClose = instance.close;
    instance.close = () => {
        originClose();
        target.classList.remove(relativeBem.b());
        target.classList.remove(scrollBem.bm('lock'));
        if (props.fullscreen) {
            fullscreenInstance = undefined;
        }
    };
    target.classList.add(relativeBem.b());
    if (lock) {
        target.classList.add(scrollBem.bm('lock'));
    }
    target.appendChild(instance.vm.$el);
    return instance;
};
