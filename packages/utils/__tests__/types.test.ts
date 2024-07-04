import * as vueShared from '@vue/shared';
import { describe, expect, it } from 'vitest';
import {
  isArray,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from '..';

describe('test function about type', () => {
  it('re-export from @vue/shared', () => {
    expect(isArray).toBe(vueShared.isArray);
    expect(isString).toBe(vueShared.isString);
    expect(isFunction).toBe(vueShared.isFunction);
    expect(isObject).toBe(vueShared.isObject);
  });

  it('test isNumber should work', () => {
    expect(isNumber(1)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber('0')).toBe(false);
  });

  it('test isBoolean should work', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean('true')).toBe(false);
    expect(isBoolean(0)).toBe(false);
  });

  it('test isUndefined should work', () => {
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined('undefined')).toBe(false);
    expect(isUndefined('null')).toBe(false);
  });
});
