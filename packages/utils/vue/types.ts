import type { ExtractPropTypes, PropType } from 'vue';
import type { IfNever, PropKey, UnknownToNever, WritableArray } from './utils';

export type Value<T> = T[keyof T];

/**
 * 提取单个 prop 的参数类型
 *
 * @example
 * ExtractPropType<{ type: StringConstructor }> => string | undefined
 * ExtractPropType<{ type: StringConstructor, required: true }> => string
 * ExtractPropType<{ type: BooleanConstructor }> => boolean
 */
export type ExtractPropType<T extends object> = Value<
  ExtractPropTypes<{
    key: T;
  }>
>;

/** 处理原始 type 类型 */
export type ResolvePropType<T> = IfNever<
  T,
  never,
  ExtractPropType<{
    type: WritableArray<T>;
    required: true;
  }>
>;

// 不允许默认原始值和 required 同时存在
/** 处理默认与必填的情况 */
export type PropInputDefaultValue<
  Required extends boolean,
  Default,
> = Required extends true
  ? never
  : Default extends Record<string, unknown> | Array<any>
    ? () => Default
    : (() => Default) | Default;

/** buildProp 输入类型 */
export interface PropOptions<Type, Value, Validator, Default, Required extends boolean> {
  type?: Type;
  required?: Required;
  default?: PropInputDefaultValue<Required, Default>;
  values?: readonly Value[];
  validator?: ((val: any) => val is Validator) | ((val: any) => boolean);
}

/** 转换为最终输出 */
export type ConvertProps<Options> = Options extends PropOptions<infer Type, infer Value, infer Validator, any, infer Required>
  ? FinalProps<Type, Value, Validator, Options['default'], Required>
  : never;

/** 合并验证类型至 type */
export type MergePropType<Type, Value, Validator, Default> =
  | IfNever<UnknownToNever<Value>, ResolvePropType<Type>, never>
  | UnknownToNever<MergeDefaultToValue<Default, Value>>
  | UnknownToNever<Validator>;

/** 合并 default 与 value 类型 */
export type MergeDefaultToValue<Default, Value> = IfNever<UnknownToNever<Default>, Value, UnknownToNever<Default> | Value>;

export type FinalProps<Type, Value, Validator, Default, Required> = {
  readonly type: PropType<MergePropType<UnknownToNever<Type>, Value, Validator, Default>>;
  readonly required: [Required] extends [true] ? true : false;
  readonly validator: IfNever<
    IfNever<UnknownToNever<Validator>, UnknownToNever<Value>, UnknownToNever<Validator>>,
    undefined,
    (val: unknown) => boolean
  >;
  [PropKey]: true;
} & IfNever<UnknownToNever<Default>, unknown, { readonly default: Default }>;
