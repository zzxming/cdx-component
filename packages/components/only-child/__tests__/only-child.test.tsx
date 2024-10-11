import { useForwardRef } from '@cdx-component/hooks';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import OnlyChild from '../src/only-child';

describe('OnlyChild.vue', () => {
  it('shouldset attr correctly', async () => {
    const fn = vi.fn();
    const buttonRef = ref();
    const wrapper = mount(defineComponent({
      setup() {
        useForwardRef(buttonRef);

        return () => h(OnlyChild, {
          ref: buttonRef,
          onClick: fn,
        }, {
          default: () => h('button', 'foo'),
        });
      },
    }));
    await wrapper.find('button').trigger('click');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(wrapper.find('button').element).toEqual(buttonRef.value);
  });

  it('should wrap span', async () => {
    const wrapper = mount(() => h(
      OnlyChild,
      null,
      {
        default: () => 'foo',
      },
    ));
    expect(wrapper.html()).contain('<span>foo</span>');
  });

  it('should get correct child', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        return () => (
          <OnlyChild>
            {{
              default: () => (
                <>
                  <div>foo</div>
                  <span>bar</span>
                </>
              ),
            }}
          </OnlyChild>
        );
      },
    }));
    const html = wrapper.html();
    expect(html).contain('<div>foo</div>');
    expect(html).not.contain('<span>bar</span>');
  });
});
