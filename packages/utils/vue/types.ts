import type { ExtractPropTypes, PropType } from 'vue';
import type { IfNever, PropKey, UnknownToNever } from './utils';

export type Value<T> = T[keyof T];
export type Writable<T> = { -readonly [P in keyof T]: T[P] };
export type WritableArray<T> = T extends readonly any[] ? Writable<T> : T;

export interface PropOptions<Type = never, Value = never, Validator = never, Default = never, Required extends boolean = false> {
  type?: Type;
  required?: Required;
  default?: Default;
  values?: readonly Value[];
  validator?: (Validator) | ((val: any) => boolean);
}

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

export type MergePropType<Type, Value, Validator> =
  | IfNever<UnknownToNever<Value>, ResolvePropType<Type>, never>
  | UnknownToNever<Value>
  | UnknownToNever<Validator>;

export type ConvertProps<Input> = Input extends PropOptions<infer Type, infer Value, infer Validator, any, infer Required>
  ? FinalProps<Type, Value, Validator, Input['default'], Required>
  : never;

export type FinalProps<Type, Value, Validator, Default, Required> = {
  readonly type: PropType<MergePropType<Type, Value, Validator>>;
  readonly required: [Required] extends [true] ? true : false;
  readonly validator: IfNever<
    IfNever<UnknownToNever<Validator>, UnknownToNever<Value>, UnknownToNever<Validator>>,
    undefined,
    ((val: unknown) => boolean)
  >;
  [PropKey]: true;
} & IfNever<UnknownToNever<Default>, unknown, { readonly default: Default }>;
