import { describe, expect, expectTypeOf, it } from 'vitest';
import type { PropType } from 'vue';
import { buildProps } from '..';
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

  // 用 toMatchTypeOf 的地方因为 toEqualTypeOf 出现报错 所以暂时用 toMatchTypeOf
  describe('buildProps', () => {
    it('should handle basic types correctly', () => {
      const propsDefinition = {
        name: String,
      };
      const props = buildProps(propsDefinition);
      expect(props.name).toBe(String);
      expectTypeOf(props).toEqualTypeOf<{
        name: StringConstructor;
      }>();
    });

    it('should set default value correctly', () => {
      const propsDefinition = {
        age: {
          type: Number,
          default: 18,
        },
      } as const;
      const props = buildProps(propsDefinition);
      expect(props.age.type).toBe(Number);
      expect(props.age.default).toBe(18);
      expectTypeOf(props).toMatchTypeOf<{
        readonly age: {
          readonly type: PropType<number>;
          readonly required: false;
          readonly default: 18;
          readonly validator: undefined;
          [PropKey]: true;
        };
      }>();
    });

    it('should mark property as required when specified', () => {
      const propsDefinition = {
        email: {
          type: String,
          required: true,
        },
      } as const;
      const props = buildProps(propsDefinition);
      expect(props.email.type).toBe(String);
      expect(props.email.required).toBe(true);
      expectTypeOf(props).toEqualTypeOf<{
        readonly email: {
          readonly type: PropType<string>;
          readonly required: true;
          readonly validator: undefined;
          [PropKey]: true;
        };
      }>();
    });

    it('should handle only values', () => {
      const propsDefinition = {
        count: {
          values: [1, 2, 3],
        },
      } as const;
      const props = buildProps(propsDefinition);
      expect(props.count.validator(0)).toBe(false);
      expect(props.count.validator(1)).toBe(true);
      expect(props.count.validator(2)).toBe(true);
      expect(props.count.validator(3)).toBe(true);
      expect(props.count.validator(4)).toBe(false);
      expectTypeOf(props).toEqualTypeOf<{
        readonly count: {
          readonly type: PropType<1 | 2 | 3>;
          readonly required: false;
          readonly validator: (val: unknown) => boolean;
          [PropKey]: true;
        };
      }>();
    });

    it('should handle validators correctly', () => {
      const propsDefinition1 = {
        status: {
          type: String,
          values: ['active', 'inactive'],
        },
      } as const;
      const props1 = buildProps(propsDefinition1);
      expect(props1.status.validator('active')).toBe(true);
      expect(props1.status.validator('pending')).toBe(false);
      expectTypeOf(props1).toEqualTypeOf<{
        readonly status: {
          readonly type: PropType<'active' | 'inactive'>;
          readonly required: false;
          readonly validator: (val: unknown) => boolean;
          [PropKey]: true;
        };
      }>();

      const propsDefinition2 = {
        code: {
          type: String,
          validator: (val: any) => val.length <= 2,
        },
      } as const;
      const props2 = buildProps(propsDefinition2);
      expect(props2.code.validator('A1')).toBe(true);
      expect(props2.code.validator('B2')).toBe(true);
      expect(props2.code.validator('C3.0')).toBe(false);
      expectTypeOf(props2).toEqualTypeOf<{
        readonly code: {
          readonly type: PropType<string | ((val: any) => boolean)>;
          readonly required: false;
          readonly validator: (val: unknown) => boolean;
          [PropKey]: true;
        };
      }>();
    });

    it('should combine custom validators with values', () => {
      const customValidator = (value: string) => value.length <= 2;
      const propsDefinition1 = {
        code: {
          type: String,
          values: ['A1', 'B2'],
          validator: customValidator,
        },
      } as const;
      const props1 = buildProps(propsDefinition1);
      expect(props1.code.validator('A1')).toBe(true);
      expect(props1.code.validator('C3')).toBe(true);
      expect(props1.code.validator('D4.1')).toBe(false);
      expectTypeOf(props1).toMatchTypeOf<{
        readonly code: {
          readonly type: PropType<'A1' | 'B2' | ((val: any) => boolean)>;
          readonly required: false;
          readonly validator: (val: unknown) => boolean;
          [PropKey]: true;
        };
      }>();

      const customNeverSuccessValidator = () => false;
      const propsDefinition2 = {
        code: {
          type: String,
          values: ['A1', 'B2'],
          validator: customNeverSuccessValidator,
        },
      } as const;
      const props2 = buildProps(propsDefinition2);
      expect(props2.code.validator('A1')).toBe(false);
      expect(props2.code.validator('B2')).toBe(false);
      expect(props2.code.validator('C3')).toBe(false);
      expectTypeOf(props1).toMatchTypeOf<{
        readonly code: {
          readonly type: PropType<'A1' | 'B2' | ((val: any) => boolean)>;
          readonly required: false;
          readonly validator: (val: unknown) => boolean;
          [PropKey]: true;
        };
      }>();
    });

    it('should correctly process a mix of prop definitions', () => {
      const propsDefinition = {
        title: String,
        name: {
          type: String,
          values: ['get', 'post'],
        },
        isActive: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          required: true,
        },
        code: {
          type: Number,
          validator: (val: any) => {
            return val >= 100 && val < 600;
          },
        },
      } as const;
      const props = buildProps(propsDefinition);
      expect(props.title).toBe(String);
      expect(props.name.type).toBe(String);
      expect(props.name.validator('get')).toBe(true);
      expect(props.name.validator('post')).toBe(true);
      expect(props.name.validator('patch')).toBe(false);
      expect(props.isActive.type).toBe(Boolean);
      expect(props.isActive.default).toBe(false);
      expect(props.status.type).toBe(String);
      expect(props.status.required).toBe(true);
      expect(props.code.type).toBe(Number);
      expect(props.code.validator(200)).toBe(true);
      expect(props.code.validator(600)).toBe(false);
      expect(props.code.validator(20)).toBe(false);
      expectTypeOf(props).toMatchTypeOf<{
        readonly title: PropType<string>;
        readonly name: {
          readonly type: PropType<'get' | 'post'>;
          readonly required: false;
          readonly validator: (val: unknown) => boolean;
          [PropKey]: true;
        };
        readonly isActive: {
          readonly type: PropType<boolean>;
          readonly required: false;
          readonly default: false;
          readonly validator: undefined;
          [PropKey]: true;
        };
        readonly status: {
          readonly type: PropType<string>;
          readonly required: true;
          readonly validator: undefined;
          [PropKey]: true;
        };
        readonly code: {
          readonly type: PropType<number | ((val: unknown) => boolean)>;
          readonly required: false;
          readonly validator: (val: unknown) => boolean;
          [PropKey]: true;
        };
      }>();
    });
  });
});
