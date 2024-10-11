import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSupportTouch } from '..';

vi.mock('@cdx-component/utils', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@cdx-component/utils')>();
  return {
    ...mod,
    supportsTouchDetector: () => 'ontouchstart' in window,
  };
});

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe('useSupportTouch', () => {
  it('should detect touch support correctly', () => {
    vi.stubGlobal('window', { ontouchstart: true });
    const wrapper = mount({
      setup() {
        const { isSupportTouch, events } = useSupportTouch();
        return { isSupportTouch, events };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.isSupportTouch).toBe(true);
    expect(wrapper.vm.events).toEqual({ down: 'touchstart', move: 'touchmove', up: 'touchend' });
  });

  it('should handle non-touch devices correctly', () => {
    vi.stubGlobal('window', {});
    const wrapper = mount({
      setup() {
        const { isSupportTouch, events } = useSupportTouch();
        return { isSupportTouch, events };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.isSupportTouch).toBe(false);
    expect(wrapper.vm.events).toEqual({ down: 'mousedown', move: 'mousemove', up: 'mouseup' });
  });

  it('should handle default support correctly', () => {
    vi.stubGlobal('window', {});
    const { isSupportTouch, events } = useSupportTouch(true);

    expect(isSupportTouch.value).toBe(true);
    expect(events.value).toEqual({ down: 'touchstart', move: 'touchmove', up: 'touchend' });
  });
});
