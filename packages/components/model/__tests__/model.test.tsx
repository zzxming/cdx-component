import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
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
});
