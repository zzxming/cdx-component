import type { ExtractPropTypes, PropType } from 'vue';
import type { IfNever, UnknownToNever } from './utils';
import { PropKey } from './utils';

export type Value<T> = T[keyof T];
export type Writable<T> = { -readonly [P in keyof T]: T[P] };
export type WritableArray<T> = T extends readonly any[] ? Writable<T> : T;

export type PropOptions<Type = never, Value = never, Default = never, Required extends boolean = false> = {
    type?: Type;
    required?: Required;
    default?: Default;
    values?: readonly Value[];
    validator?: (val: any) => boolean;
};

export type ExtractPropType<T extends object> = Value<
    ExtractPropTypes<{
        key: T;
    }>
>;
export type ResolvePropType<T> = IfNever<
    T,
    never,
    ExtractPropType<{
        type: WritableArray<T>;
        required: true;
    }>
>;
export type MergePropType<Type, Value> =
    | IfNever<UnknownToNever<Value>, ResolvePropType<Type>, never>
    | UnknownToNever<Value>;

export type ConvertProps<Input> = Input extends PropOptions<infer Type, infer Value, any, infer Required>
    ? FinalProps<Type, Value, Input['default'], Required>
    : never;
export type FinalProps<Type, Value, Default, Required> = {
    readonly type: PropType<MergePropType<Type, Value>>;
    readonly required: [Required] extends [true] ? true : false;
    readonly validator: ((val: unknown) => boolean) | undefined;
    [PropKey]: true;
} & IfNever<UnknownToNever<Default>, unknown, { readonly default: Default }>;
