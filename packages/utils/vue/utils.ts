import { getCurrentScope, onScopeDispose } from 'vue';

export const PropKey = '__propKey';

export type IfFinalProp<T, Y = true, N = false> = T extends { [PropKey]: true } ? Y : N;
export type NativePropType = ((...args: any) => any) | { new (...args: any): any } | undefined | null;
export type IfNativePropType<T, Y = true, N = false> = [T] extends [NativePropType] ? Y : N;
export type IfNever<T, Y = true, N = false> = [T] extends [never] ? Y : N;
export type IfUnknown<T, Y, N> = [unknown] extends [T] ? Y : N;
export type UnknownToNever<T> = IfUnknown<T, never, T>;

export type Writable<T> = { -readonly [K in keyof T]: T[K] };
export type WritableArray<T> = T extends readonly any[] ? Writable<T> : T;

export const tryOnScopeDispose = (fn: (...args: any[]) => any) => {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
};
