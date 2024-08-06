import { useBem, useSupportTouch } from '@cdx-component/hooks';
import { withInstallDirective } from '@cdx-component/utils';
import type { ObjectDirective } from 'vue';

type HTMLEResizeElement = HTMLElement & {
  _startDragData: { x: number; y: number; width: number; height: number };
  _directionDraggers: HTMLElement[];
  _resizeObserver: ResizeObserver;
};

const size = 8;
const { events, defineEventPosition } = useSupportTouch();
const [, bem] = useBem('resize');
const id = bem.be('container');
let container: HTMLElement;

const createContainer = () => {
  container = document.createElement('div');
  container.id = id;
  document.body.appendChild(container);
  return container;
};
const getBoundingPage = (el: HTMLElement, direction: string) => {
  const { scrollX, scrollY } = window;
  const rect = el.getBoundingClientRect();
  const top = rect.top + scrollY - size / 2;
  const left = rect.left + scrollX - size / 2;
  const bottom = rect.bottom + scrollY - size / 2;
  const right = rect.right + scrollX - size / 2;
  const width = rect.width + size;
  const height = rect.height + size;
  return {
    top: `${direction === 'bottom' ? bottom : top}px`,
    left: `${direction === 'right' ? right : left}px`,
    width: `${['left', 'right'].includes(direction) ? size : width}px`,
    height: `${['top', 'bottom'].includes(direction) ? size : height}px`,
  };
};
const createResizeHandlers = (el: HTMLEResizeElement, directions: string[]) => {
  if (el._directionDraggers) {
    for (const item of el._directionDraggers) item.remove();
    el._directionDraggers = [];
  }

  const resizeXHandler = (e: Event) => {
    e.preventDefault();
    const { x } = defineEventPosition(e);
    const { x: startX, width } = el._startDragData;
    const newWidth = Math.max(0, x - startX + width);
    el.style.width = `${newWidth}px`;
  };
  const resizeYHandler = (e: Event) => {
    e.preventDefault();
    const { y } = defineEventPosition(e);
    const { y: startY, height } = el._startDragData;
    const newHeight = Math.max(0, y - startY + height);
    el.style.height = `${newHeight}px`;
  };
  const resizeEndHandler = () => {
    document.removeEventListener(events.value.move, resizeXHandler);
    document.removeEventListener(events.value.move, resizeYHandler);
    document.removeEventListener(events.value.up, resizeEndHandler);
  };

  el._directionDraggers = directions.map((direction) => {
    const dragger = document.createElement('div');
    dragger.className = `${bem.be('dragger')} ${direction}`;
    dragger.dataset.direction = direction;
    dragger.addEventListener(events.value.down, (e) => {
      e.preventDefault();
      const { x, y } = defineEventPosition(e);
      const { width, height } = window.getComputedStyle(el);
      el._startDragData = { x, y, width: Number.parseFloat(width), height: Number.parseFloat(height) };
      document.addEventListener(events.value.move, ['top', 'bottom'].includes(direction) ? resizeYHandler : resizeXHandler);
      document.addEventListener(events.value.up, resizeEndHandler);
    });
    return dragger;
  });

  el._resizeObserver = new ResizeObserver(() => {
    for (const dragger of el._directionDraggers) {
      Object.assign(dragger.style, getBoundingPage(el, dragger.dataset.direction!));
    }
  });
  el._resizeObserver.observe(el);

  if (!container || !document.body.querySelector(`#${id}`)) {
    container = createContainer();
  }
  for (const dragger of el._directionDraggers) {
    container.appendChild(dragger);
  }
};

export const vResizeDirective: ObjectDirective<HTMLEResizeElement> = {

  mounted(el, binding) {
    const directions = [];
    if (binding.modifiers.top) directions.push('top');
    if (binding.modifiers.left) directions.push('left');
    if (binding.modifiers.right) directions.push('right');
    if (binding.modifiers.bottom) directions.push('bottom');
    createResizeHandlers(el, directions);
  },
  updated(el, binding) {
    const directions = [];
    if (binding.modifiers.top) directions.push('top');
    if (binding.modifiers.left) directions.push('left');
    if (binding.modifiers.right) directions.push('right');
    if (binding.modifiers.bottom) directions.push('bottom');
    for (const dragger of el._directionDraggers) dragger.remove();
    createResizeHandlers(el, directions);
  },
  beforeUnmount(el) {
    for (const dragger of el._directionDraggers) dragger.remove();
  },
};
export default withInstallDirective(vResizeDirective, 'resize');
