import { nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useLockScroll } from '..';

describe('uselock-scroll', () => {
  it('should lock and unlock scroll correctly', async () => {
    const trigger = ref(false);
    const target = document.createElement('div');
    document.body.appendChild(target);

    useLockScroll(trigger, { target });

    expect(target.classList.contains('cdx-scroll--lock')).toBe(false);
    trigger.value = true;
    await nextTick();
    expect(target.classList.contains('cdx-scroll--lock')).toBe(true);

    document.body.removeChild(target);
  });
});
