import { assert, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import PullRefresh from '../src/pull-refresh.vue';

vi.mock('@cdx-component/hooks/use-support-touch', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@cdx-component/hooks/use-support-touch')>();
  return {
    ...mod,
    useSupportTouch: () => ({
      isSupportTouch: ref(false),
      events: ref({
        down: 'mousedown',
        move: 'mousemove',
        up: 'mouseup',
      }),
    }),
  };
});

describe('PullRefresh.vue', () => {
  it('render test', async () => {
    const wrapper = mount(() => (
      <PullRefresh>
        {{
          default: () => new Array(10).fill(0).map((_, i) => <li>{i}</li>),
        }}
      </PullRefresh>
    ));
    expect(wrapper.text()).toEqual('0123456789');
  });

  it('event should handle', async () => {
    const triggerEvent = async (el: Node, event: string, options: any = {}) => {
      const cusEvent = new CustomEvent(event) as any;
      for (const [key, value] of Object.entries(options)) {
        cusEvent[key] = value;
      }
      el.dispatchEvent(cusEvent);
      vi.runOnlyPendingTimers();
      await nextTick();
    };

    const loading = ref(false);
    const refreshHandle = vi.fn();
    const wrapper = mount(() => (
      <PullRefresh v-model={loading.value} onRefresh={refreshHandle}>
        {{
          default: () => new Array(10).fill(0).map((_, i) => <li>{i}</li>),
        }}
      </PullRefresh>
    ));
    vi.useFakeTimers();

    const track = wrapper.find('.cdx-pull-refresh__track');

    await triggerEvent(track.element, 'mousedown', { clientY: 0 });
    await triggerEvent(document, 'mousemove', { clientY: 0 });
    await triggerEvent(document, 'mousemove', { clientY: 100 });
    await triggerEvent(document, 'mouseup');

    expect(refreshHandle).toBeCalledTimes(1);
    assert.isTrue(loading.value);

    loading.value = false;
    await nextTick();
    expect(wrapper.find('.cdx-pull-refresh__head').text()).toEqual('');
  });
});
