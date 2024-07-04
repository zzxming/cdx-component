import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { caf, raf } from '../'; // 替换为实际模块路径

let isServerMocked = true;
vi.mock('../types', () => ({
  get isServer() {
    return isServerMocked;
  },
}));
describe('RAF and CAF Functions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should call the callback with the correct time on the client', async () => {
    isServerMocked = false;

    const fn = vi.fn();
    raf(() => fn('first'));
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
      ]
    `);

    raf(() => fn('second'));
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
        [
          "second",
        ],
      ]
    `);

    const handle = raf(() => fn('cancel'));
    caf(handle);
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
        [
          "second",
        ],
      ]
    `);
  });

  it('should use setTimeout on the server', () => {
    isServerMocked = true;

    const fn = vi.fn();
    raf(() => fn('first'));
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
      ]
    `);

    raf(() => fn('second'));
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
        [
          "second",
        ],
      ]
    `);

    const handle = raf(() => fn('cancel'));
    caf(handle);
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
        [
          "second",
        ],
      ]
    `);
  });
});
