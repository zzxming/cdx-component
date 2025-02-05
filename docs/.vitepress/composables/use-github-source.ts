import type { Ref } from 'vue';
import { computed, ref } from 'vue';

export const useGithubSource = (
  path: Ref<string>,
  dir = ref('docs'),
  folder = ref('demos'),
  branch = ref('master'),
  repo = ref('zzxming/cdx-component'),
) => {
  const url = computed(() => {
    return `https://github.com/${repo.value}/edit/${branch.value}/${dir.value}/${folder.value}/${path.value}`;
  });
  return { url };
};
