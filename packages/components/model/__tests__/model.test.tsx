import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';
import Model from '..';

describe('Model.vue', () => {
  it('render test', async () => {
    const visible = ref(true);
    const wrapper = mount(() => (
      <Model modelValue={visible.value}>
        {{
          header: () => 'header',
          default: () => 'default',
          footer: () => 'footer',
        }}
      </Model>
    ));
    const html = wrapper.html();
    expect(html).toContain('<div class="cdx-model__header">header</div>');
    expect(html).toContain('<div class="cdx-model__body">default</div>');
    expect(html).toContain('<div class="cdx-model__footer">footer</div>');
  });

  it('should destory content', async () => {
    const visible = ref(false);
    const wrapper = mount(
      <Model v-model={visible.value}>
        {{
          header: () => 'header',
          default: () => 'default',
          footer: () => 'footer',
        }}
      </Model>,
    );
    expect(wrapper.find('.cdx-model__content').exists()).toBe(false);
    await nextTick();

    visible.value = true;
    // trigger transition enter event
    (wrapper.vm as any).handleTransitionEnter();
    await nextTick();
    expect(wrapper.find('.cdx-model__content').exists()).toBe(true);
    const html = wrapper.html();
    expect(html).toContain('<div class="cdx-model__header">header</div>');
    expect(html).toContain('<div class="cdx-model__body">default</div>');
    expect(html).toContain('<div class="cdx-model__footer">footer</div>');
  });
});
