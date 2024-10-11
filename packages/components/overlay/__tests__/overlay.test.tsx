import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, ref } from 'vue';
import Overlay from '../src/overlay.vue';

describe('Overlay.vue', () => {
  it('render test', async () => {
    const wrapper = mount(() => <Overlay>Lorem</Overlay>);
    expect(wrapper.text()).toEqual('Lorem');
  });

  it('should emit click event', async () => {
    const wrapper = mount(() => <Overlay></Overlay>);
    await wrapper.find('.cdx-overlay').trigger('click');
    expect(wrapper.emitted()).toBeTruthy();
  });

  it('should bind modelValue', async () => {
    const visible = ref(true);
    const onClick = vi.fn(() => visible.value = !visible.value);
    const Component = defineComponent({
      setup() {
        return () => (
          <Overlay v-model={visible.value}>
            <div class="content" onClick={onClick}>Lorem</div>
          </Overlay>
        );
      },
    });
    const wrapper = mount(Component, { attachTo: document.body });
    await wrapper.find('.content').trigger('click');
    expect(wrapper.emitted()).toBeTruthy();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(visible.value).toBe(false);
    expect(wrapper.find('.content').isVisible()).toBe(false);
  });
});
