import { computed, ref } from 'vue';
import type { Ref } from 'vue';
export const useGithubSource = (
    path: Ref<string>,
    dir = ref('docs'),
    ext = ref('.vue'),
    folder = ref('demos'),
    branch = ref('dev'),
    repo = ref('zzxming/cdx-component'),
) => {
    const url = computed(() => {
        return `https://github.com/${repo.value}/edit/${branch.value}/${dir.value}/${folder.value}/${path.value}${ext.value}`;
    });
    return { url };
};
