import { onBeforeMount, onUnmounted } from 'vue';

let container: HTMLElement | null = null;
export const useTeleportContainer = (id: string) => {
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
  onUnmounted(() => {
    container?.children.length === 0 && container?.remove();
  });
  return {
    id,
    selector,
  };
};
