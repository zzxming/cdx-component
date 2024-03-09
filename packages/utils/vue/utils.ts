export const PropKey = '__propKey';
export type IfFinalProp<T, Y = true, N = false> = T extends { [PropKey]: true } ? Y : N;

export type IfNever<T, Y = true, N = false> = [T] extends [never] ? Y : N;
export type NativePropType = ((...args: any) => any) | { new (...args: any): any } | undefined | null;
export type IfNativePropType<T, Y = true, N = false> = [T] extends [NativePropType] ? Y : N;
export type IfUnknown<T, Y = true, N = false> = [unknown] extends [T] ? Y : N;
export type UnknownToNever<T> = IfUnknown<T, never, T>;
