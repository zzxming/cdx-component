import type { Writable } from './vue';

export const isServer = typeof window === 'undefined';
export const isUndefined = (val: any): val is undefined => val === undefined;
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
export const isNumber = (val: any): val is number => typeof val === 'number';
export { isString, isArray, isFunction, isObject } from '@vue/shared';

export const keepConstType = <T extends readonly any[] | Record<string, any>>(val: T) => val as Writable<T>;
