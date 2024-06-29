import type { PropType } from 'vue';
import { isObject, isUndefined } from '../types';
import type { ConvertProps, FinalProps, PropOptions } from './types';
import type { IfFinalProp, IfNativePropType, NativePropType } from './utils';
import { PropKey } from './utils';

export const definePropType = <T>(val: any): PropType<T> => val;
export const buildProp = <Type = never, Value = never, Default = never, Required extends boolean = false>(
  prop: PropOptions<Type, Value, Default, Required>,
): FinalProps<Type, Value, Default, Required> => {
  if (!isObject(prop)) return prop;
  const { type, required, default: defaultValue, values, validator } = prop;

  const _validator
        = values || validator
          ? (val: any) => {
              let valid = false;
              let allowValues: any[] = [];
              if (values) {
                allowValues = Array.from(values);
                if (defaultValue) allowValues.push(defaultValue);
                valid = allowValues.includes(val);
              }
              if (validator) valid = validator(val);
              return valid;
            }
          : undefined;

  const resultProp = {
    type,
    required: !!required,
    validator: _validator,
    [PropKey]: true,
  } as any;
  if (!isUndefined(defaultValue)) resultProp.default = defaultValue;
  return resultProp;
};
export const buildProps = <
  Props extends Record<string, { [PropKey]: true } | NativePropType | PropOptions<any, any, any, any>>,
>(
  props: Props,
): {
  [K in keyof Props]: IfFinalProp<Props[K], Props[K], IfNativePropType<Props[K], Props[K], ConvertProps<Props[K]>>>;
} =>
  Object.entries(props).reduce((acc, [k, v]) => {
    acc[k] = buildProp(v as any);
    return acc;
  }, {} as any);
