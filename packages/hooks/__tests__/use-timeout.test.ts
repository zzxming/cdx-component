import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimeout } from '..';

describe('use-timeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start a timeout correctly', async () => {
    const fn = vi.fn();
    const { startTimeout } = useTimeout();

    startTimeout(fn, 1000);
    vi.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalled();
  });

  it('should clear a timeout correctly', async () => {
    const fn = vi.fn();
    const { startTimeout, clearTimeout } = useTimeout();

    startTimeout(fn, 1000);
    clearTimeout();

    expect(fn).not.toHaveBeenCalled();
  });
});
