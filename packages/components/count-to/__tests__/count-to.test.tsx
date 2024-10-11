import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import CountTo from '..';

vi.mock('@cdx-component/utils/raf', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@cdx-component/utils/raf')>();
  return {
    ...mod,
    raf: (fn: (t: number) => void) => {
      let lastTime = 0;
      const currTime = Date.now();
      const timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
      return setTimeout(() => {
        fn(currTime + timeToCall);
        lastTime = currTime + timeToCall;
      }, timeToCall);
    },
    caf: (id: number) => clearTimeout(id),
  };
});
beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('CounTo.vue', () => {
  it('count test', async () => {
    const wrapper = mount(() => <CountTo endValue={100} />);
    expect(wrapper.html()).toContain('<span class="cdx-count-to">000</span>');
    vi.runAllTimers();
    await nextTick();
    expect(wrapper.html()).toContain('<span class="cdx-count-to">100</span>');
  });

  it('decimal test', async () => {
    const wrapper = mount(() => <CountTo endValue={100} decimal={2} />);
    expect(wrapper.html()).toContain('<span class="cdx-count-to">000.00</span>');
    vi.runAllTimers();
    await nextTick();
    expect(wrapper.html()).toContain('<span class="cdx-count-to">100.00</span>');
  });

  it('test expose', async () => {
    const wrapper = mount(() => {
      const countRef = ref<InstanceType<typeof CountTo>>();

      const stopCount = () => {
        countRef.value?.stopCount();
      };
      const startCount = () => {
        countRef.value?.startCount();
      };
      const reset = () => {
        countRef.value?.reset();
      };
      return (
        <>
          <button class="pause" onClick={stopCount}>pause</button>
          <button class="start" onClick={startCount}>start</button>
          <button class="reset" onClick={reset}>reset</button>
          <CountTo autoStart={false} ref={countRef} endValue={100} duration={2000} />
        </>
      );
    });
    const countComp = wrapper.findComponent(CountTo);
    expect(countComp.html()).toContain('<span class="cdx-count-to">000</span>');
    await wrapper.find('.start').trigger('click');
    vi.advanceTimersByTime(300);
    await nextTick();
    const num = Number(countComp.text());
    expect(num).toBeLessThan(100);
    expect(num).toBeGreaterThan(0);

    await wrapper.find('.pause').trigger('click');
    vi.advanceTimersByTime(300);
    await nextTick();
    const pausedNum = Number(countComp.text());
    expect(pausedNum).toEqual(num);

    await wrapper.find('.start').trigger('click');
    vi.advanceTimersByTime(2000);
    await nextTick();
    expect(Number(countComp.text())).toEqual(100);

    await wrapper.find('.reset').trigger('click');
    await nextTick();
    expect(countComp.text()).toEqual('000');
  });
});
