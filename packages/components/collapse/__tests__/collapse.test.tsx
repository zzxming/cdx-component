import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';
import CdxCollapse, { CdxCollapseItem } from '..';

describe('Collapse', () => {
  it('switch test', async () => {
    const activeName = ref(['1']);
    const wrapper = mount(() => (
      <CdxCollapse v-model={activeName.value}>
        <CdxCollapseItem name="1" title="1">1</CdxCollapseItem>
        <CdxCollapseItem name="2" title="2">2</CdxCollapseItem>
      </CdxCollapse>
    ));

    const items = wrapper.findAll('.cdx-collapse-item');
    expect(items.length).toBe(2);
    expect(items[0].find('.cdx-collapse-item__content').text()).toEqual('1');

    await items[0].find('.cdx-collapse-item__header').trigger('click');
    await items[1].find('.cdx-collapse-item__header').trigger('click');
    await nextTick();
    expect(items[0].find('.cdx-collapse-item__content').exists()).toBe(false);
    expect(items[1].find('.cdx-collapse-item__content').text()).toEqual('2');
  });

  it('test only item', async () => {
    const visible = ref(false);
    const wrapper = mount(() => (
      <CdxCollapseItem v-model:expend={visible.value} name="1" title="1">1</CdxCollapseItem>
    ));

    expect(wrapper.find('.cdx-collapse-item__content').exists()).toBe(false);
    await wrapper.find('.cdx-collapse-item__header').trigger('click');
    await nextTick();
    expect(wrapper.find('.cdx-collapse-item__content').text()).toBe('1');
  });
});
