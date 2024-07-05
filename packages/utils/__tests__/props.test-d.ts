import { describe, expectTypeOf, it } from 'vitest';
import type { PropType } from 'vue';
import { buildProp, definePropType } from '..';
import type { IfNever, IfUnknown, PropKey, Writable, WritableArray } from '..';

describe('test function about vue props', () => {
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
      expectTypeOf<IfUnknown<unknown>>().toEqualTypeOf<true>();
      expectTypeOf<IfUnknown<string>>().toEqualTypeOf<false>();
    });
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
      } >();
    });

    it('should handle required with values', () => {
      expectTypeOf(
        buildProp({
          values: ['a', 'b', 'c'],
          required: true,
        } as const),
      ).toEqualTypeOf<{
        readonly type: PropType<'a' | 'b' | 'c' >;
        readonly required: true;
        readonly validator: (val: unknown) => boolean;
        [PropKey]: true;
      }>();
    });

    // it('should handle validators correctly', () => {
    //   const propsDefinition1 = {
    //     status: {
    //       type: String,
    //       values: ['active', 'inactive'],
    //     },
    //   } as const;
    //   const props1 = buildProps(propsDefinition1);
    //   expect(props1.status.validator('active')).toBe(true);
    //   expect(props1.status.validator('pending')).toBe(false);
    //   expectTypeOf(props1).toEqualTypeOf<{
    //     readonly status: {
    //       readonly type: PropType<'active' | 'inactive'>;
    //       readonly required: false;
    //       readonly validator: (val: unknown) => boolean;
    //       [PropKey]: true;
    //     };
    //   }>();

    //   const propsDefinition2 = {
    //     code: {
    //       type: String,
    //       validator: (val: any) => val.length <= 2,
    //     },
    //   } as const;
    //   const props2 = buildProps(propsDefinition2);
    //   expect(props2.code.validator('A1')).toBe(true);
    //   expect(props2.code.validator('B2')).toBe(true);
    //   expect(props2.code.validator('C3.0')).toBe(false);
    //   expectTypeOf(props2).toEqualTypeOf<{
    //     readonly code: {
    //       readonly type: PropType<string>;
    //       readonly required: false;
    //       readonly validator: (val: unknown) => boolean;
    //       [PropKey]: true;
    //     };
    //   }>();
    // });

    // it('should combine custom validators with values', () => {
    //   const customValidator = (value: string) => value.length <= 2;
    //   const propsDefinition1 = {
    //     code: {
    //       type: String,
    //       values: ['A1', 'B2'],
    //       validator: customValidator,
    //     },
    //   } as const;
    //   const props1 = buildProps(propsDefinition1);
    //   expect(props1.code.validator('A1')).toBe(true);
    //   expect(props1.code.validator('C3')).toBe(true);
    //   expect(props1.code.validator('D4.1')).toBe(false);
    //   expectTypeOf(props1).toEqualTypeOf<{
    //     readonly code: {
    //       readonly type: PropType<'A1' | 'B2'>;
    //       readonly required: false;
    //       readonly validator: (val: unknown) => boolean;
    //       [PropKey]: true;
    //     };
    //   }>();

    //   const customNeverSuccessValidator = () => false;
    //   const propsDefinition2 = {
    //     code: {
    //       values: ['A1', 'B2'],
    //       validator: customNeverSuccessValidator,
    //     },
    //   } as const;
    //   const props2 = buildProps(propsDefinition2);
    //   expect(props2.code.validator('A1')).toBe(false);
    //   expect(props2.code.validator('B2')).toBe(false);
    //   expect(props2.code.validator('C3')).toBe(false);
    //   expectTypeOf(props1).toEqualTypeOf<{
    //     readonly code: {
    //       readonly type: PropType<'A1' | 'B2'>;
    //       readonly required: false;
    //       readonly validator: (val: unknown) => boolean;
    //       [PropKey]: true;
    //     };
    //   }>();
    // });

    // it('should correctly process a mix of prop definitions', () => {
    //   const w = buildProp({
    //     type: String,
    //   });
    //   const propsDefinition = {
    //     title: String,
    //     // name: {
    //     //   values: ['get', 'post'],
    //     // },
    //     // isActive: {
    //     //   type: Boolean,
    //     //   default: false,
    //     // },
    //     // status: {
    //     //   type: String,
    //     //   required: true,
    //     // },
    //     // code: {
    //     //   type: Number,
    //     //   validator: (val: any) => {
    //     //     return val >= 100 && val < 600;
    //     //   },
    //     // },
    //   } as const;
    //   const props = buildProps(propsDefinition);
    //   // expect(props.title).toBe(String);
    //   // expect(props.name.type).toBe(String);
    //   // expect(props.name.validator('get')).toBe(true);
    //   // expect(props.name.validator('post')).toBe(true);
    //   // expect(props.name.validator('patch')).toBe(false);
    //   // expect(props.isActive.type).toBe(Boolean);
    //   // expect(props.isActive.default).toBe(false);
    //   // expect(props.status.type).toBe(String);
    //   // expect(props.status.required).toBe(true);
    //   // expect(props.code.type).toBe(Number);
    //   // expect(props.code.validator(200)).toBe(true);
    //   // expect(props.code.validator(600)).toBe(false);
    //   // expect(props.code.validator(20)).toBe(false);
    //   expectTypeOf(props.title).toEqualTypeOf<StringConstructor>();
    //     // readonly name: {
    //     //   readonly type: PropType<'get' | 'post'>;
    //     //   readonly required: false;
    //     //   readonly validator: (val: unknown) => boolean;
    //     //   [PropKey]: true;
    //     // };
    //     // readonly isActive: {
    //     //   readonly type: PropType<boolean>;
    //     //   readonly required: false;
    //     //   readonly default: false;
    //     //   readonly validator: undefined;
    //     //   [PropKey]: true;
    //     // };
    //     // readonly status: {
    //     //   readonly type: PropType<string>;
    //     //   readonly required: true;
    //     //   readonly validator: undefined;
    //     //   [PropKey]: true;
    //     // };
    //     // readonly code: {
    //     //   readonly type: PropType<number>;
    //     //   readonly required: false;
    //     //   readonly validator: (val: unknown) => boolean;
    //     //   [PropKey]: true;
    //     // };
    //   }>();
    // });
  });
});
