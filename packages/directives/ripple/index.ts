import { useBem, useSupportTouch } from '@cdx-component/hooks';
import { supportsTouchDetector, withInstallDirective } from '@cdx-component/utils';
import type { ObjectDirective } from 'vue';

const [,bem] = useBem('ripple');

export type RippleEl = HTMLElement & {
  _ripple: {
    position?: string;
  };
};

const bindRipple = (el: RippleEl) => {
  const { events, defineEventPosition } = useSupportTouch(supportsTouchDetector());
  const showRipple = async (e: Event) => {
    !el._ripple && (el._ripple = {});

    const container = document.createElement('div');
    container.className = bem.be('container');
    const ripple = document.createElement('div');
    ripple.classList.add(bem.b());
    ripple.classList.add(bem.bm('in'));
    container.appendChild(ripple);
    el.appendChild(container);

    const { width, height, position } = window.getComputedStyle(el);
    if (!el._ripple.position) {
      el._ripple.position = position;
    }
    const size = Math.sqrt(Number.parseFloat(width) ** 2 + Number.parseFloat(height) ** 2);
    const { x, y } = defineEventPosition(e);
    const elRect = el.getBoundingClientRect();
    const { transitionDuration } = window.getComputedStyle(ripple);
    const [transformDuration, opacityDuration] = transitionDuration.split(', ');
    const transformDelay = transformDuration.endsWith('ms') ? Number.parseFloat(transformDuration) : Number.parseFloat(transformDuration) * 1000;
    const opacityDelay = opacityDuration.endsWith('ms') ? Number.parseFloat(opacityDuration) : Number.parseFloat(opacityDuration) * 1000;

    el.style.position = 'relative';

    setTimeout(() => {
      if (document.contains(ripple)) {
        Object.assign(ripple.style, {
          width: `${size * 2}px`,
          height: `${size * 2}px`,
          left: `${x - elRect.left - size}px`,
          top: `${y - elRect.top - size}px`,
          transform: 'scale(1)',
        });
      }
    }, 0);
    setTimeout(() => {
      if (document.contains(ripple)) {
        ripple.classList.add(bem.bm('out'));
        setTimeout(() => {
          if (el.contains(container)) {
            el.removeChild(container);
          }
          if (el.getElementsByClassName(bem.be('container')).length === 0) {
            el.style.position = el._ripple.position!;
          }
        }, opacityDelay);
      }
    }, transformDelay);
  };

  el.addEventListener(events.value.down, showRipple, { passive: true });
};

export const vRipple: ObjectDirective<RippleEl> = {
  mounted(el) {
    bindRipple(el);
  },
};
export const CdxRippleDirective = withInstallDirective(vRipple, 'ripple');
