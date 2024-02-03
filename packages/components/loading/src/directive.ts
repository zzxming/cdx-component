import { type Directive, createApp, type DirectiveBinding } from 'vue';
import LoadingVue from './loading.vue';
import { useZIndex } from '@cdx-component/hooks';

const LOADING_INSTANCE = Symbol('loading');
export interface ElementLoading extends HTMLElement {
    [LOADING_INSTANCE]?: ReturnType<typeof createLoadingInstance>;
}

const createLoadingInstance = () => {
    const loadingInstance = createApp(LoadingVue);
    const instance = loadingInstance.mount(document.createElement('div'));
    instance.$el.style.zIndex = useZIndex().nextZIndex();
    return loadingInstance;
};
const bindLoadingInstance = (el: ElementLoading, binding: DirectiveBinding<boolean>) => {
    el[LOADING_INSTANCE] = createLoadingInstance();
    el.appendChild(el[LOADING_INSTANCE]._container!);
    Object.assign(el.style, { position: 'relative' });
};
const unmounLoadingInstance = (el: ElementLoading) => {
    if (el[LOADING_INSTANCE]?._container) {
        el.removeChild(el[LOADING_INSTANCE]._container);
        el[LOADING_INSTANCE].unmount();
        delete el[LOADING_INSTANCE];
    }
};
export const vLoading: Directive<ElementLoading, boolean> = {
    mounted(el, binding) {
        if (binding.value) {
            bindLoadingInstance(el, binding);
        }
    },
    updated(el, binding) {
        if (binding.value) {
            !el[LOADING_INSTANCE] && bindLoadingInstance(el, binding);
        } else {
            unmounLoadingInstance(el);
        }
    },
    unmounted(el) {
        unmounLoadingInstance(el);
    },
};
