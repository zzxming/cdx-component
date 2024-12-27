import type { ExtractPropTypes, PropType } from 'vue';
import type { IfNever, IfUnknown, PropKey, Writable, WritableArray } from '..';
import { describe, expectTypeOf, it } from 'vitest';
import { buildProp, buildProps, definePropType, keepConstType } from '..';

describe('test types about vue props', () => {
  describe('types', () => {
    it('Writable', () => {
      expectTypeOf<Writable<readonly [1, 2, 3]>>().toEqualTypeOf<[1, 2, 3]>();
      expectTypeOf<Writable<Readonly<{ a: 'b' }>>>().toEqualTypeOf<{ a: 'b' }>();
      expectTypeOf<Writable<123>>().toEqualTypeOf<123>();
      expectTypeOf<Writable<StringConstructor>>().not.toEqualTypeOf<StringConstructor>();
    });

    it('WritableArray', () => {
      expectTypeOf<WritableArray<readonly [1, 2, 3]>>().toEqualTypeOf<[1, 2, 3]>();
      expectTypeOf<WritableArray<BooleanConstructor>>().toEqualTypeOf<BooleanConstructor>();
    });

    it('IfNever should identify never type correctly', () => {
      expectTypeOf<IfNever<never>>().toEqualTypeOf<true>();
      expectTypeOf<IfNever<string | boolean | '1' | 1>>().toEqualTypeOf<false>();
    });

    it('IfUnknown should identify unknown type correctly', () => {
      expectTypeOf<IfUnknown<unknown, true, false>>().toEqualTypeOf<true>();
      expectTypeOf<IfUnknown<string, true, false>>().toEqualTypeOf<false>();
    });
  });

  describe('definePropType', () => {
    expectTypeOf(definePropType<1 | 2 | 3>(Number)).toEqualTypeOf<PropType<1 | 2 | 3>>();
    expectTypeOf(definePropType<'a' | 'b'>(String)).toEqualTypeOf<PropType<'a' | 'b'>>();
    expectTypeOf(definePropType<number[]>(Array)).toEqualTypeOf<PropType<number[]>>();
    expectTypeOf(definePropType<{ key: Set<any> }>(Object)).toEqualTypeOf<PropType<{ key: Set<any> }>>();
  });

  describe('buildProps', () => {
    it('should handle only type correctly', () => {
      expectTypeOf(
        buildProp({
          type: String,
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<string>;
        readonly required: false;
        readonly validator: undefined;
        [PropKey]: true;
      }>();

      expectTypeOf(
        buildProp({
          type: [String, Number, Boolean],
        }),
      )
        .toEqualTypeOf<{
        readonly type: PropType<string | number | boolean>;
        readonly required: false;
        readonly validator: undefined;
        [PropKey]: true;
      }>();

      expectTypeOf(
        buildProp({
          type: definePropType<'a' | 'b'>(String),
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<'a' | 'b'>;
        readonly required: false;
        readonly validator: undefined;
        [PropKey]: true;
      }>();
    });

    it('should set value limit correctly', () => {
      expectTypeOf(
        buildProp({
          values: ['a', 'b', 'c'],
        } as const),
      ).toEqualTypeOf< {
        readonly type: PropType<'a' | 'b' | 'c'>;
        readonly required: false;
        readonly validator: (val: unknown) => boolean;
        [PropKey]: true;
      }>();

      expectTypeOf(
        buildProp({
          type: String,
          values: ['a', 'b', 'c'],
        } as const),
      ).toEqualTypeOf< {
        readonly type: PropType<'a' | 'b' | 'c'>;
        readonly required: false;
        readonly validator: (val: unknown) => boolean;
        [PropKey]: true;
      }>();
    });

    it('should set type and values correctly', () => {
      expectTypeOf(
        buildProp({
          type: Number,
          values: [1, 2, 3, 4],
          default: 4,
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<1 | 2 | 3 | 4>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean);
        [PropKey]: true;
      } & { readonly default: 4 }>();
    });

    it('should validator correctly', () => {
      expectTypeOf(
        buildProp({
          values: ['a', 'b', 'c'],
          validator: (val: unknown): val is number => typeof val === 'number',
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<'a' | 'b' | 'c' | number>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean);
        [PropKey]: true;
      }>();

      expectTypeOf(
        buildProp({
          validator: (val: any): val is string => val.length <= 2,
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<string>;
        readonly required: false;
        readonly validator: (val: unknown) => boolean;
        [PropKey]: true;
      }>();
    });

    it('should handle required with validator', () => {
      expectTypeOf(
        buildProp({
          required: true,
          validator: (val: unknown): val is string => true,
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<string>;
        readonly required: true;
        readonly validator: (val: unknown) => boolean;
        [PropKey]: true;
      }>();
    });

    it('should handle required with values', () => {
      expectTypeOf(
        buildProp({
          values: ['a', 'b', 'c'],
          required: true,
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<'a' | 'b' | 'c'>;
        readonly required: true;
        readonly validator: (val: unknown) => boolean;
        [PropKey]: true;
      }>();
    });

    it('should handle value and default', () => {
      expectTypeOf(
        buildProp({
          values: ['a', 'b', 'c'],
          default: 'd',
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<'a' | 'b' | 'c' | 'd'>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean);
        [PropKey]: true;
      } & { readonly default: 'd' }>();
    });

    it('should handle type and Array default value', () => {
      expectTypeOf(
        buildProp({
          type: definePropType<string[]>(Array),
          default: () => keepConstType(['a', 'b'] as const),
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<string[] | ['a', 'b']>;
        readonly required: false;
        readonly validator: undefined;
        [PropKey]: true;
      } & { readonly default: ['a', 'b'] }>();
    });

    it('should handle type and Object default value', () => {
      interface Options {
        key: string;
      }

      expectTypeOf(
        buildProp({
          type: definePropType<Options>(Object),
          default: () => keepConstType({ key: 'value' } as const),
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<Options | { key: 'value' }>;
        readonly required: false;
        readonly validator: undefined;
        [PropKey]: true;
      } & { readonly default: { key: 'value' } }>();

      expectTypeOf(
        buildProp({
          type: Object,
          default: () => keepConstType({} as const),
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<Record<string, any> | {}>;
        readonly required: false;
        readonly validator: undefined;
        [PropKey]: true;
      } & { readonly default: {} }>();
    });

    it('should combine custom validators with values', () => {
      expectTypeOf(
        buildProp({
          type: definePropType<'a' | 'b' | 'c'>(String),
          required: true,
          validator: (val: unknown): val is number => true,
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<'a' | 'b' | 'c' | number>;
        readonly required: true;
        readonly validator: (val: unknown) => boolean;
        [PropKey]: true;
      }>();
    });

    it('should extract type', () => {
      const _props1 = {
        key1: buildProp({
          type: String,
        }),
        key2: buildProp({
          type: [String, Number],
          required: true,
        }),
      } as const;
      expectTypeOf<ExtractPropTypes<typeof _props1>>().branded.toEqualTypeOf<{
        readonly key1?: string;
        readonly key2: string | number;
      }>();

      const _prop2 = {
        key1: String,
        key2: {
          type: Number,
        },
        key3: {
          type: String,
          required: true,
        },
      } as const;
      expectTypeOf<ExtractPropTypes<typeof _prop2>>().toEqualTypeOf<{
        readonly key3: string;
      } & {
        readonly key1?: string;
        readonly key2?: number;
      }>();
    });

    it('should correctly process a mix of prop definitions', () => {
      const props = buildProps({
        key1: String,
        key2: {
          values: ['get', 'post'],
        },
        key3: {
          type: Boolean,
          default: false,
        },
        key4: {
          type: String,
          required: true,
        },
        key5: {
          validator: (val: any): val is number => val >= 100 && val < 600,
        },
        key6: {
          type: [String, Number, Function],
          default: () => '123' as const,
        },
        key7: Date,
        key8: Set,
      } as const);
      expectTypeOf(props.key1).toEqualTypeOf<StringConstructor>();
      expectTypeOf(props.key2).toEqualTypeOf<{
        readonly type: PropType<'get' | 'post'>;
        readonly required: false;
        readonly validator: (val: unknown) => boolean;
        [PropKey]: true;
      }>();
      expectTypeOf(props.key3).toEqualTypeOf<{
        readonly type: PropType<boolean>;
        readonly required: false;
        readonly validator: undefined;
        [PropKey]: true;
      } & { readonly default: false }>();
      expectTypeOf(props.key4).toEqualTypeOf<{
        readonly type: PropType<string>;
        readonly required: true;
        readonly validator: undefined;
        [PropKey]: true;
      }>();
      expectTypeOf(props.key5).toEqualTypeOf<{
        readonly type: PropType<number>;
        readonly required: false;
        readonly validator: (val: unknown) => boolean;
        [PropKey]: true;
      }>();
      expectTypeOf(props.key6).toEqualTypeOf<{
        readonly type: PropType<string | number | Function>;
        readonly required: false;
        readonly validator: undefined;
        [PropKey]: true;
      } & { readonly default: () => '123' }>();
      expectTypeOf(props.key7).toEqualTypeOf<DateConstructor>();
      expectTypeOf(props.key8).toEqualTypeOf<SetConstructor>();
    });
  });
});
