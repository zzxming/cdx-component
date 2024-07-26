import { beforeEach, describe, expect, it } from 'vitest';
import { useZIndex } from '..';

describe('use-z-index', () => {
  let startZIndex: number;
  let useZIndexResult: ReturnType<typeof useZIndex>;

  beforeEach(() => {
    useZIndexResult = useZIndex();
    startZIndex = useZIndexResult.currentZIndex.value;
  });

  it('should initialize with correct zIndex value', () => {
    expect(useZIndexResult.currentZIndex.value).toBe(startZIndex);
  });

  it('should increment the zIndex value when nextZIndex is called', () => {
    useZIndexResult.nextZIndex();
    expect(useZIndexResult.currentZIndex.value).toBe(startZIndex + 1);
  });

  it('should return the updated zIndex value when nextZIndex is called multiple times', () => {
    useZIndexResult.nextZIndex();
    useZIndexResult.nextZIndex();
    useZIndexResult.nextZIndex();
    expect(useZIndexResult.currentZIndex.value).toBe(startZIndex + 3);
  });
});
