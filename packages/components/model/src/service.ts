import { VNode, createApp, defineComponent, h, ref, watch } from 'vue';
import { ModelProps } from './model';
import ModelVue from './model.vue';
import { isUndefined } from '@cdx-component/utils';

export interface ModelOptions extends Exclude<Partial<ModelProps>, 'fullscreen' | 'modelValue'> {
    header?: VNode | string;
    body: VNode | string;
    footer?: VNode | string;
    target?: HTMLElement;
}
export const createModelInstance = (options: ModelOptions) => {
    const { target = document.body, header, body, footer, ...props } = options;

    const model = defineComponent({
        name: 'CdxModel',
        setup() {
            return () =>
                h(
                    ModelVue,
                    {
                        ...props,
                    },
                    {
                        header: header ? () => header : null,
                        default: body ? () => body : null,
                        footer: footer ? () => footer : null,
                    }
                );
        },
    });
    const modelValue = ref(true);
    const modelInstance = createApp(model, {
        ...props,
        fullscreen: isUndefined(props.fullscreen) ? (target === document.body ? true : false) : props.fullscreen,
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value: any) => {
            modelValue.value = value;
        },
    });
    const vm = modelInstance.mount(document.createElement('div'));
    target.appendChild(vm.$el);

    watch(modelValue, () => {
        if (!modelValue.value) {
            close();
        }
    });

    const close = () => {
        if (vm.$.isUnmounted) return;
        vm.$el.remove();
        modelInstance.unmount();
    };

    return close;
};
