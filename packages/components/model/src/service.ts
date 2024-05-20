import { VNode, createApp, defineComponent, h, reactive } from 'vue';
import { ModelProps } from './model';
import ModelVue from './model.vue';
import { isString, isUndefined } from '@cdx-component/utils';

export interface ModelOptions extends Partial<Omit<ModelProps, 'modelValue'>> {
    header?: VNode | string;
    body: VNode | string;
    footer?: VNode | string;
    target?: string | HTMLElement;
}

const resolveOptions = (options: ModelOptions) => {
    let target: HTMLElement;
    if (isString(options.target)) {
        target = document.querySelector(options.target) ?? document.body;
    } else {
        target = options.target || document.body;
    }
    return {
        width: options.width || '50%',
        fullscreen: isUndefined(options.fullscreen) ? (target === document.body ? true : false) : options.fullscreen,
        maskClose: options.maskClose ?? true,
        destroyOnClose: options.destroyOnClose ?? true,
        target,
        header: options.header,
        body: options.body,
        footer: options.footer,
    };
};

let unmountTimer = setTimeout(() => {}, 0);
export const createModelInstance = (options: ModelOptions) => {
    const { target, header, body, footer, ...props } = resolveOptions(options);

    const model = defineComponent({
        name: 'CdxModel',
        setup() {
            return () =>
                h(
                    ModelVue,
                    {
                        ...props,
                        modelValue: data.visible,
                        'onUpdate:modelValue': (value: boolean) => {
                            data.visible = value;
                        },
                    },
                    {
                        header: header ? () => header : null,
                        default: body ? () => body : null,
                        footer: footer ? () => footer : null,
                    },
                );
        },
    });
    const data = reactive({
        visible: true,
    });
    const close = () => {
        clearTimeout(unmountTimer);
        unmountTimer = setTimeout(() => {
            if (vm) {
                vm.$el.remove();
                modelInstance.unmount();
            }
        }, 300);
        data.visible = false;
    };
    const modelInstance = createApp(model, {
        ...props,
        onClose: close,
    });
    const container = document.createElement('div');
    const vm = modelInstance.mount(container);
    Array.from(container.children).map((child) => target.appendChild(child));

    data.visible = true;
    return {
        close,
    };
};
