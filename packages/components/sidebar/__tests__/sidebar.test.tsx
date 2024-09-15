import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import Sidebar from '..';

beforeEach(() => {
  const mockComputed = vi.fn().mockImplementation(() => {
    return {
      overflowY: 'visible',
      overflowX: 'visible',
      transform: 'none',
    };
  });

  vi.stubGlobal('getComputedStyle', mockComputed);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Sidebar.vue', () => {
  it('render test', async () => {
    const visible = ref(true);
    const wrapper = mount(() => (
      <div class="root">
        <Sidebar modelValue={visible.value}>
          {{
            default: () => 'content',
          }}
        </Sidebar>
      </div>
    ));
    const html = wrapper.html();
    expect(html).toContain('<div class="cdx-sidebar__content">content</div>');
    expect(wrapper.attributes('style')).toBe('overflow-x: hidden; transform: translate3d(0, 0, 0);');

    expect(wrapper.get('.cdx-sidebar').attributes('class')).toContain('active');
    visible.value = false;
    await nextTick();
    expect(wrapper.get('.cdx-sidebar').attributes('class')).not.toContain('active');
  });

  it('unmount sidebar should clear style', async () => {
    const visible = ref(true);
    const wrapper = mount(() => (
      <div class="root">
        {
          visible.value
            ? (
                <Sidebar modelValue={true}>
                  {{
                    default: () => 'content',
                  }}
                </Sidebar>
              )
            : null
        }
      </div>
    ));
    expect(wrapper.attributes('style')).toBe('overflow-x: hidden; transform: translate3d(0, 0, 0);');
    visible.value = false;
    await nextTick();
    expect(wrapper.attributes('style')).toBe('overflow-x: visible; transform: none;');
  });
});
