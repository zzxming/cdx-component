import { describe, expect, it } from 'vitest';
import { ensureArray } from '..';

describe('test function about array', () => {
  describe('ensureArray', () => {
    it('should return the array if the input is already an array', () => {
      expect(ensureArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(ensureArray(Array.prototype)).toEqual([]);
    });

    it('should wrap a single non-array value in an array', () => {
      const str = 'singleValue';
      const obj = { key: 'value' };
      const nullInput = null;
      const undefinedInput = undefined;
      expect(ensureArray(0)).toEqual([0]);
      expect(ensureArray(str)).toEqual([str]);
      expect(ensureArray(obj)).toEqual([obj]);
      expect(ensureArray(nullInput)).toEqual([null]);
      expect(ensureArray(undefinedInput)).toEqual([undefined]);
    });
  });
});
