import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { buildProps } from '..';

describe('test function about vue props', () => {
  describe('buildProps', () => {
    it('should handle value correctly', () => {
      const warnHandler = vi.fn();
      const Foo = defineComponent({
        props: buildProps({
          bar: { type: Boolean },
          baz: { values: ['a', 'b', 'c'] },
          qux: { values: ['a', 'b', 'c'], default: 'd' },
          qux2: { values: ['a', 'b', 'c'], required: true },
        } as const),
        template: `{{ $props }}`,
      });
      const props = mount(Foo, {
        props: {} as any,
        global: {
          config: {
            warnHandler,
          },
        },
      }).props();

      expect(warnHandler.mock.calls[0][0]).toBe('Missing required prop: "qux2"');

      expect(props.bar).toBe(false);
      expect(props.baz).toBe(undefined);
      expect(props.qux).toBe('d');
      expect(props.qux2).toBe(undefined);
    });
  });
});
