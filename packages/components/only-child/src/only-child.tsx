import type { ObjectDirective, Slots, VNode } from 'vue';
import { Comment, Fragment, Text, cloneVNode, defineComponent, inject, withDirectives } from 'vue';
import { NOOP } from '@vue/shared';
import { FORWARD_PROVIDE_KEY } from '@cdx-component/hooks';
import { isArray, isObject } from '@cdx-component/utils';

const createElementDirective = (setRef: <T>(el: T) => void = NOOP) => {
  const setRefDirective: ObjectDirective<HTMLElement> = {
    mounted(el) {
      setRef(el);
    },
    updated(el) {
      setRef(el);
    },
    unmounted() {
      setRef(null);
    },
  };
  return setRefDirective;
};
const wrapTextContent = (s: string | VNode) => {
  return <span>{s}</span>;
};
const getOnlyDefaultChild = (vnode: VNode[]): VNode | null => {
  if (!vnode) return null;
  for (const child of vnode) {
    if (isObject(child)) {
      switch (child.type) {
        case Comment: {
          continue;
        }
        case Text:{
          return wrapTextContent(child);
        }
        case Fragment: {
          if (isArray(child.children)) {
            return getOnlyDefaultChild(child.children as VNode[]);
          }
          if (!child.children || !(child.children as Slots).default) return null;
          return getOnlyDefaultChild((child.children as Slots).default!());
        }
        case 'template':{
          return getOnlyDefaultChild(child.children as VNode[]);
        }
        default: {
          return child;
        }
      }
    }
    return wrapTextContent(child);
  }
  return null;
};

// inject ref doesn't need to bind on CdxOnlyChild. it will override the directive binding.
export default defineComponent({
  name: 'CdxOnlyChild',
  setup(_, { slots, attrs }) {
    const forwardInject = inject(FORWARD_PROVIDE_KEY);
    const directive = createElementDirective(forwardInject?.setForwardRef || NOOP);

    return () => {
      const defaultChild = slots.default!(attrs);
      if (defaultChild.length !== 1) {
        console.error('OnlyChild requires only one valid child.');
        return null;
      }
      const firstChild = getOnlyDefaultChild(defaultChild);
      if (!firstChild) {
        console.error('OnlyChild cannot find any valid child.');
        return null;
      }
      return withDirectives(
        cloneVNode(firstChild, attrs),
        [[directive]],
      );
    };
  },
});
