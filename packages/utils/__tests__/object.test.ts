import { describe, expect, it } from 'vitest';
import { pick } from '..';

describe('test function about object', () => {
  describe('pick', () => {
    const obj = { a: 1, b: 2, c: 3 };
    it('should return an empty object when given an empty object', () => {
      expect(pick({}, [])).toEqual({});
    });

    it('should return the same object when picking all keys', () => {
      expect(pick(obj, ['a', 'b', 'c'])).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should return an object with picked keys', () => {
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });
  });
});
