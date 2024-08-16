import { useBem, useSupportTouch } from '@cdx-component/hooks';
import { supportsTouchDetector, withInstallDirective } from '@cdx-component/utils';
import type { ObjectDirective } from 'vue';

const RippleData = Symbol('ripple-data');
const [, bem] = useBem('ripple');

export type RippleEl = HTMLElement & {
  [RippleData]: {
    position?: string;
  };
};

// TODO: 鼠标左右键连续点击时触发的 mousedown 与 mouseup 次数不同

const bindRipple = (el: RippleEl) => {
  const { events, defineEventPosition } = useSupportTouch(supportsTouchDetector());
  const showRipple = async (e: Event) => {
    !el[RippleData] && (el[RippleData] = {});

    const container = document.createElement('div');
    container.className = bem.be('container');
    const ripple = document.createElement('div');
    ripple.classList.add(bem.b());
    ripple.classList.add(bem.bm('in'));
    container.appendChild(ripple);
    el.appendChild(container);

    const { width, height, position } = window.getComputedStyle(el);
    if (!el[RippleData].position) {
      el[RippleData].position = position;
    }
    const size = Math.sqrt(Number.parseFloat(width) ** 2 + Number.parseFloat(height) ** 2);
    const { x, y } = defineEventPosition(e);
    const elRect = el.getBoundingClientRect();

    el.style.position = 'relative';
    ripple.dataset.start = Date.now().toString();

    Object.assign(ripple.style, {
      width: `${size * 2}px`,
      height: `${size * 2}px`,
      left: `${x - elRect.left - size}px`,
      top: `${y - elRect.top - size}px`,
      transform: 'scale(1)',
    });
  };
  const hideRipple = () => {
    const ripple = el.getElementsByClassName(bem.b())[0] as HTMLElement;
    if (!ripple) return;

    const { transitionDuration } = window.getComputedStyle(ripple);
    const [transformDuration, opacityDuration] = transitionDuration.split(', ');
    const transformDelay = transformDuration.endsWith('ms') ? Number.parseFloat(transformDuration) : Number.parseFloat(transformDuration) * 1000;
    const opacityDelay = opacityDuration.endsWith('ms') ? Number.parseFloat(opacityDuration) : Number.parseFloat(opacityDuration) * 1000;
    const delay = Math.max(0, transformDelay - Date.now() + Number.parseFloat(ripple.dataset.start!));

    setTimeout(() => {
      ripple.classList.add(bem.bm('out'));
      setTimeout(() => {
        const ripple = el.getElementsByClassName(bem.b())[0];
        ripple.parentNode?.parentNode === el && el.removeChild(ripple.parentNode);

        const container = el.getElementsByClassName(bem.be('container'));
        if (container.length === 0) {
          el.style.position = el[RippleData].position!;
        }
      }, opacityDelay);
    }, delay);
  };

  el.addEventListener(events.value.down, showRipple, { passive: true });
  el.addEventListener(events.value.up, hideRipple, { passive: true });

  el.addEventListener('mouseleave', hideRipple, { passive: true });
  el.addEventListener('touchcancel', hideRipple, { passive: true });
  el.addEventListener('dragstart', hideRipple, { passive: true });
};

export const vRipple: ObjectDirective<RippleEl> = {
  mounted(el) {
    bindRipple(el);
  },
};
export const CdxRippleDirective = withInstallDirective(vRipple, 'ripple');
