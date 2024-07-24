import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TextEllipsis from '../src/text-ellipsis.vue';

vi.mock('../src/utils', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../src/utils')>();
  return {
    ...mod,
    cloneNode: (node: HTMLElement, content: string) => {
      const copy = mod.cloneNode(node, content);
      if (content.length > 10) {
        let offsetHeight = 72;
        Object.defineProperty(copy, 'offsetHeight', {
          get: () => Math.max(offsetHeight -= 8, 32),
        });
      }
      else {
        Object.defineProperty(copy, 'offsetHeight', {
          get: () => 10,
        });
      }
      return copy;
    },
  };
});
beforeEach(() => {
  vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
    paddingTop: '8px',
    paddingBottom: '8px',
    lineHeight: '16px',
  }) as CSSStyleDeclaration);
});
afterEach(() => {
  vi.restoreAllMocks();
});
const TEXT = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos repellat adipisci nulla amet dolorem veritatis. Assumenda sapiente vel nihil repellendus beatae delectus molestiae, recusandae quo autem neque, provident magnam! Blanditiis?';

describe('TextEllipsis', () => {
  beforeEach(() => {
    window.innerWidth = 300;
    window.innerHeight = 600;
    vi.resetModules();
  });

  it('collapse test', async () => {
    const wrapper = mount(() => <TextEllipsis content={TEXT} />);
    await nextTick();
    expect(wrapper.text()).toEqual('Lorem ipsum dolor, sit amet consectetur adipisicing elit. ...展开');
    await wrapper.find('.cdx-text-ellipsis__expand-btn').trigger('click');
    expect(wrapper.text()).toEqual(`${TEXT}收起`);
  });

  it('render test', async () => {
    const wrapper = mount(() => (
      <TextEllipsis content={TEXT.slice(0, 10)} />
    ));
    await nextTick();
    expect(wrapper.text()).toEqual(TEXT.slice(0, 10));
  });
});
