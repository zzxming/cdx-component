import { isRef, watch, onScopeDispose } from 'vue';
import type { Ref } from 'vue';
import { useBem } from '../use-bem';
import { getScrollBarWidth } from '@cdx-component/utils';
import { namespace } from '@cdx-component/constants';

export const useLockScroll = (trigger: Ref<boolean>, { target = document.body } = {}) => {
    if (!isRef(trigger)) {
        throw new Error('[useLockScroll]: You need to pass a ref param to this function');
    }
    const [, bem] = useBem('scroll');
    const clockClass = bem.bm('lock');
    if (target.classList.contains(clockClass)) return;

    const cleanLock = () => {
        target && (target.style.width = originWidth);
        target.classList.remove(clockClass);
    };

    let scrollBarWidth = 0;
    let originWidth = '0';
    watch(trigger, (value) => {
        if (!value) {
            return cleanLock();
        }

        const hasHiddenClass = target.classList.contains(clockClass);
        if (!hasHiddenClass) {
            originWidth = target.style.width;
        }
        scrollBarWidth = getScrollBarWidth(namespace, { target });
        const hasOverflow =
            (target === document.body ? document.documentElement : target).clientHeight < target.scrollHeight;
        const overflowY = getComputedStyle(target).overflowY;
        // 当前滚动条存在才减去宽度
        if (scrollBarWidth > 0 && (hasOverflow || overflowY === 'scroll') && !hasHiddenClass) {
            document.body.style.width = `calc(100% - ${scrollBarWidth}px)`;
        }
        target.classList.add(clockClass);
    });
    onScopeDispose(() => cleanLock());
};
