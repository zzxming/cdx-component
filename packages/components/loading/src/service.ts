import { createApp, defineComponent, h, reactive } from 'vue';
import { useBem } from '@cdx-component/hooks';
import LoadingVue from './loading.vue';
import { LoadingInstance, ServiceOptions } from './types';
import { isString } from '@cdx-component/utils';

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
    data.visible = true;

    return {
        instance: loadingInstance,
        vm,
        close,
    };
};

let fullscreenInstance: LoadingInstance | undefined = undefined;
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

const resolveOptions = (options: ServiceOptions = {}) => {
    let target: HTMLElement;
    if (isString(options.target)) {
        target = document.querySelector(options.target) ?? document.body;
    } else {
        target = options.target || document.body;
    }
    return {
        text: options.text || '',
        background: options.background || '',
        fullscreen: target === document.body && (options.fullscreen ?? true),
        lock: options.lock ?? true,
        target,
    };
};
