<script lang="ts" setup>
import { demosProps, VitepressDemoPreview } from 'vitepress-plugin-preview/component';
import { computed, ref, useSlots } from 'vue';
import { useDocBem, useGithubSource, usePlayground } from '../composables';
import { defaultMutipleDemoFile } from '../utils';
import 'vitepress-plugin-preview/index.css';

const props = defineProps(demosProps);
const slots = useSlots();

const [, bem] = useDocBem('example');

let originDefaultDemoFileIndex = -1;
const sortDefaultDemoFile = (sortArr: any[]) => {
  const arr = [...sortArr];
  if (originDefaultDemoFileIndex !== -1) {
    arr.splice(0, 0, arr.splice(originDefaultDemoFileIndex, 1)[0]);
  }
  return arr;
};
const filesPath = computed(() => {
  const files = props.files.split(',');
  originDefaultDemoFileIndex = files.indexOf(defaultMutipleDemoFile);
  if (originDefaultDemoFileIndex === -1) return files;
  return [defaultMutipleDemoFile, ...files.filter(f => f !== defaultMutipleDemoFile)];
});
const rawSourceArr = computed(() => sortDefaultDemoFile(props.rawSource.split(',')));

const index = ref(props.isFile ? 0 : filesPath.value.indexOf(defaultMutipleDemoFile));
const currentPath = computed(() => `${props.src}${!props.isFile ? `/${filesPath.value[index.value]}` : ''}`);
const { link: playgroundLink } = usePlayground(props.isFile ? filesPath.value[0] : defaultMutipleDemoFile, filesPath.value, rawSourceArr.value.map(s => decodeURIComponent(s)));

const { url } = useGithubSource(currentPath);
const gotoPlayground = () => window.open(playgroundLink);
const gotoGithub = () => window.open(url.value);
</script>

<template>
  <VitepressDemoPreview v-bind="props">
    <template v-for="(slot, name) in slots" :key="name" #[name]>
      <slot :name="name" />
    </template>
    <template #icons>
      <CdxIcon
        :class="bem.be('actions-btn')"
        title="在 Playground 编辑"
        @click="gotoPlayground"
      >
        <i-ic:baseline-build />
      </CdxIcon>
      <CdxIcon
        :class="bem.be('actions-btn')"
        title="在 Github 编辑"
        @click="gotoGithub"
      >
        <i-ic:twotone-create />
      </CdxIcon>
    </template>
  </VitepressDemoPreview>
</template>

<style lang="less" scoped>
.doc-example {
  &__actions-btn {
    margin: 0 0.25rem;
    color: var(--vp-c-text-3);
    cursor: pointer;
    &:hover {
      color: var(--vp-c-text-1);
    }
  }
}
</style>
