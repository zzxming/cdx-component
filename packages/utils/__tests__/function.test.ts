import { describe, expect, it } from 'vitest';
import { cacheFunction } from '..';

describe('test function about function', () => {
  describe('cacheFunction', () => {
    it('should cache the result of the function', () => {
      let callCount = 0;
      const mockFunc = (): number => {
        callCount++;
        return Math.random();
      };
      const cachedMockFunc = cacheFunction(mockFunc);

      const firstResult = cachedMockFunc();
      expect(callCount).toBe(1);

      const secondResult = cachedMockFunc();
      expect(callCount).toBe(1);

      expect(secondResult).toBe(firstResult);
    });
  });
});
