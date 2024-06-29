import { computed, ref } from 'vue';

const zIndex = ref(1000);

export const useZIndex = () => {
  const currentZIndex = computed(() => zIndex.value);
  const nextZIndex = () => {
    zIndex.value += 1;
    return currentZIndex.value;
  };
  return {
    currentZIndex,
    nextZIndex,
  };
};
