import { useBem } from '@cdx-component/hooks';

let scrollBarWidth: number;
export const getScrollBarWidth = ({ target = document.body } = {}): number => {
  if (scrollBarWidth !== undefined) return scrollBarWidth;
  const [, bem] = useBem('lock-scroll');

  const outer = document.createElement('div');
  outer.className = bem.be('wrap');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  target.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode?.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
};
