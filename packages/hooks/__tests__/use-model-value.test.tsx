import { describe, expect, it } from 'vitest';
import { defineComponent, ref } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useModelValue } from '..';

const Comp = defineComponent({
  props: {
    modelValue: Number,
  },
  setup(props) {
    const { model } = useModelValue(props, -1);

    const add = () => {
      model.value++;
    };
    const minus = () => {
      model.value--;
    };

    return () => {
      return (
        <>
          <button class="add" onClick={add}>
            add
          </button>
          <button class="minus" onClick={minus}>
            minus
          </button>
          { model.value }
        </>
      );
    };
  },
});

describe('useModelValue', () => {
  it('should render default value', () => {
    const wrapper: VueWrapper<any> = mount(Comp);
    expect(wrapper.text()).toContain('-1');
    wrapper.unmount();
  });

  it('should not be changed when there is a modelValue but no updateModelValue', async () => {
    const wrapper: VueWrapper<any> = mount(Comp, {
      props: {
        modelValue: 1,
      },
    });
    expect(wrapper.text()).toContain('1');

    await wrapper.find('.add').trigger('click');
    expect(wrapper.text()).toContain('1');

    await wrapper.find('.minus').trigger('click');
    expect(wrapper.text()).toContain('1');

    wrapper.unmount();
  });

  it('should bind with modelValue', async () => {
    const model = ref(1);
    const wrapper: VueWrapper<any> = mount({
      setup: () => () =>
        <Comp v-model={model.value} />,
    });
    expect(wrapper.findComponent(Comp).text()).toContain('1');

    await wrapper.findComponent(Comp).find('.add').trigger('click');
    await wrapper.findComponent(Comp).find('.add').trigger('click');
    expect(wrapper.findComponent(Comp).text()).toContain('3');
    expect(model.value).toBe(3);

    await wrapper.findComponent(Comp).find('.minus').trigger('click');
    expect(wrapper.findComponent(Comp).text()).toContain('2');
    expect(model.value).toBe(2);

    wrapper.unmount();
  });

  it('should render with object defulat', async () => {
    const ObjComp = defineComponent({
      props: {
        modelValue: Object,
      },
      setup(props) {
        const { model } = useModelValue(props, { a: 1, b: 2 });

        const add = () => {
          model.value.c = 3;
        };
        const modify = () => {
          model.value.a = 3;
        };

        return () => {
          return (
            <>
              <button class="add" onClick={add}>
                add
              </button>
              <button class="modify" onClick={modify}>
                modify
              </button>
              { JSON.stringify(model.value) }
            </>
          );
        };
      },
    });

    const wrapper: VueWrapper<any> = mount(ObjComp);
    expect(wrapper.text()).toContain(JSON.stringify({ a: 1, b: 2 }));

    await wrapper.find('.add').trigger('click');
    expect(wrapper.text()).toContain(JSON.stringify({ a: 1, b: 2, c: 3 }));

    await wrapper.find('.modify').trigger('click');
    expect(wrapper.text()).toContain(JSON.stringify({ a: 3, b: 2, c: 3 }));

    wrapper.unmount();
  });

  it('should bind with object', async () => {
    const ObjComp = defineComponent({
      props: {
        modelValue: Object,
      },
      setup(props) {
        const { model } = useModelValue(props, {});

        const add = () => {
          model.value.c = 3;
        };
        const modify = () => {
          model.value.a = 3;
        };
        const change = () => {
          model.value = { c: 3, d: 4 };
        };

        return () => {
          return (
            <>
              <button class="add" onClick={add}>
                add
              </button>
              <button class="modify" onClick={modify}>
                modify
              </button>
              <button class="change" onClick={change}>
                change
              </button>
              { JSON.stringify(model.value) }
            </>
          );
        };
      },
    });

    const model = ref({ a: 1, b: 2 });
    const wrapper: VueWrapper<any> = mount({
      setup: () => () =>
        <ObjComp v-model={model.value} />,
    });
    expect(wrapper.findComponent(ObjComp).text()).toContain(JSON.stringify(model.value));

    await wrapper.findComponent(ObjComp).find('.add').trigger('click');
    expect(wrapper.findComponent(ObjComp).text()).toContain(JSON.stringify({ a: 1, b: 2, c: 3 }));
    expect(model.value).toEqual({ a: 1, b: 2, c: 3 });

    await wrapper.findComponent(ObjComp).find('.modify').trigger('click');
    expect(wrapper.findComponent(ObjComp).text()).toContain(JSON.stringify({ a: 3, b: 2, c: 3 }));
    expect(model.value).toEqual({ a: 3, b: 2, c: 3 });

    await wrapper.findComponent(ObjComp).find('.change').trigger('click');
    expect(wrapper.findComponent(ObjComp).text()).toContain(JSON.stringify({ c: 3, d: 4 }));
    expect(model.value).toEqual({ c: 3, d: 4 });

    wrapper.unmount();
  });

  it('should render with array defulat', async () => {
    const ObjComp = defineComponent({
      props: {
        modelValue: Array,
      },
      setup(props) {
        const { model } = useModelValue(props, [1, 2, 3]);

        const add = () => {
          model.value.push(4);
        };
        const modify = () => {
          model.value[0] = 3;
        };

        return () => {
          return (
            <>
              <button class="add" onClick={add}>
                add
              </button>
              <button class="modify" onClick={modify}>
                modify
              </button>
              { model.value }
            </>
          );
        };
      },
    });

    const wrapper: VueWrapper<any> = mount(ObjComp);
    expect(wrapper.text()).toContain('123');

    await wrapper.find('.add').trigger('click');
    expect(wrapper.text()).toContain('1234');

    await wrapper.find('.modify').trigger('click');
    expect(wrapper.text()).toContain('3234');

    wrapper.unmount();
  });

  it('should bind with array', async () => {
    const ObjComp = defineComponent({
      props: {
        modelValue: Array,
      },
      setup(props) {
        const { model } = useModelValue(props, []);

        const add = () => {
          model.value.push(4);
        };
        const modify = () => {
          model.value[0] = 3;
        };

        return () => {
          return (
            <>
              <button class="add" onClick={add}>
                add
              </button>
              <button class="modify" onClick={modify}>
                modify
              </button>
              { model.value }
            </>
          );
        };
      },
    });

    const model = ref([1, 2, 3]);
    const wrapper: VueWrapper<any> = mount({
      setup: () => () =>
        <ObjComp v-model={model.value} />,
    });
    expect(wrapper.findComponent(ObjComp).text()).toContain('123');

    await wrapper.findComponent(ObjComp).find('.add').trigger('click');
    expect(wrapper.findComponent(ObjComp).text()).toContain('1234');
    expect(model.value).toEqual([1, 2, 3, 4]);

    await wrapper.findComponent(ObjComp).find('.modify').trigger('click');
    expect(wrapper.findComponent(ObjComp).text()).toContain('3234');
    expect(model.value).toEqual([3, 2, 3, 4]);

    wrapper.unmount();
  });
});
