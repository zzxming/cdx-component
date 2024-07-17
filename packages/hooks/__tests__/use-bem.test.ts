import { describe, expect, it } from 'vitest';
import { useBem } from '..';

describe('use-bem', () => {
  it('should use the prefixed name in BEM functions', () => {
    const [preName, bem] = useBem('header', 'app');
    expect(preName).toBe('app-header');
    expect(bem.b()).toBe('app-header');
    expect(bem.be('element')).toBe('app-header__element');
    expect(bem.bm('modifier')).toBe('app-header--modifier');
    expect(bem.bem('element', 'modifier')).toBe('app-header__element--modifier');
    expect(bem.ns('namespace')).toBe('app-namespace');
    expect(bem.bs('namespace')).toBe('app-header-namespace');
    expect(bem.cv('variable')).toBe('--app-variable');
  });

  it('shoudle be default namespace', () => {
    const [preName, bem] = useBem('block');

    expect(preName).toBe('cdx-block');
    expect(bem.b()).toBe('cdx-block');
    expect(bem.be('element')).toBe('cdx-block__element');
    expect(bem.bm('modifier')).toBe('cdx-block--modifier');
    expect(bem.bem('element', 'modifier')).toBe('cdx-block__element--modifier');
    expect(bem.ns('namespace')).toBe('cdx-namespace');
    expect(bem.bs('namespace')).toBe('cdx-block-namespace');
    expect(bem.cv('variable')).toBe('--cdx-variable');
  });
});
