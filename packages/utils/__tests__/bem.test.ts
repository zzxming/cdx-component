import { describe, expect, it } from 'vitest';
import { createNamespace } from '..';

describe('test function about bem', () => {
  describe('createNamespace', () => {
    it('should return the correct namespace bem function', () => {
      const [namespace, bem] = createNamespace('ns', 'component');

      expect(namespace).toBe('ns-component');
      expect(bem.b()).toBe('ns-component');
      expect(bem.be('modifier')).toBe('ns-component__modifier');
      expect(bem.bm('mod')).toBe('ns-component--mod');
      expect(bem.bem('modifier', 'extra')).toBe('ns-component__modifier--extra');
      expect(bem.ns('sub')).toBe('ns-sub');
      expect(bem.bs('sub')).toBe('ns-component-sub');
      expect(bem.cv('var')).toBe('--ns-var');
    });
  });
});
