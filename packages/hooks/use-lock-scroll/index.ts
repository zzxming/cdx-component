import { isRef, watch } from 'vue';
import type { Ref } from 'vue';
import { getScrollBarWidth, tryOnScopeDispose } from '@cdx-component/utils';
import { namespace } from '@cdx-component/constants';
import { useBem } from '../use-bem';

export const useLockScroll = (trigger: Ref<boolean>, { target = document.body } = {}) => {
  if (!isRef(trigger)) {
    throw new Error('[useLockScroll]: You need to pass a ref param to this function');
  }

  let scrollBarWidth = 0;
  let originWidth = '0';

  const [, bem] = useBem('scroll');
  const clockClass = bem.bm('lock');

  const cleanLock = () => {
    target && (target.style.width = originWidth);
    target.classList.remove(clockClass);
  };

  watch(
    trigger,
    (value) => {
      const hasHiddenClass = target.classList.contains(clockClass);
      if (!hasHiddenClass) {
        originWidth = target.style.width;
      }
      scrollBarWidth = getScrollBarWidth(namespace, { target });
      const hasOverflow = (target === document.body ? document.documentElement : target).clientHeight < target.scrollHeight;
      const overflowY = getComputedStyle(target).overflowY;
      if (!value) {
        return cleanLock();
      }
      // 当前滚动条存在才减去宽度
      if (scrollBarWidth > 0 && (hasOverflow || overflowY === 'scroll') && !hasHiddenClass) {
        target.style.width = `calc(100% - ${scrollBarWidth}px)`;
      }
      target.classList.add(clockClass);
    },
    { immediate: true, flush: 'post' },
  );

  tryOnScopeDispose(() => {
    cleanLock();
  });
};
