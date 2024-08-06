import { useBem } from '@cdx-component/hooks';
import { onBeforeMount } from 'vue';

let container: HTMLElement;
export const useTooltipContainter = () => {
  const [, bem] = useBem('tooltip');
  const id = bem.be('container');
  const selector = `#${id}`;
  const createContainer = () => {
    container = document.createElement('div');
    container.id = id;
    document.body.appendChild(container);
    return container;
  };

  onBeforeMount(() => {
    if (!container || !document.body.querySelector(selector)) {
      container = createContainer();
    }
  });
  return {
    id,
    selector,
  };
};
