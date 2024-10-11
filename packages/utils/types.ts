import type { Writable } from './vue';
import { cacheFunction } from './function';

export const isServer = typeof window === 'undefined';
export const isUndefined = (val: any): val is undefined => val === undefined;
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
export const isNumber = (val: any): val is number => typeof val === 'number';
export { isArray, isFunction, isObject, isString } from '@vue/shared';

export const keepConstType = <T extends readonly any[] | Record<string, any>>(val: T) => val as Writable<T>;

export const supportsTouchDetector = cacheFunction<boolean>(() => 'ontouchstart' in window);
