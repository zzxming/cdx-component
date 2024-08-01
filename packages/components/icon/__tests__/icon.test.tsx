import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Icon from '..';

describe('Icon.vue', () => {
  it('render test', async () => {
    const wrapper = mount(() => <Icon>text</Icon>);
    expect(wrapper.html()).toContain('<i class="cdx-icon">text</i>');
  });
});
