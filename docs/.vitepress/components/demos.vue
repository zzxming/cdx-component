<script lang="ts" setup>
import { computed, ref } from 'vue';
import { usePlayground } from '../composables';
import { defaultMutipleDemoFile } from '../utils';

const props = defineProps<{
  src: string;
  demos: object;
  rawSource: string;
  source: string;
  files: string;
  isFile: boolean;
}>();

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
const formatPathDemos = computed(() => {
  const demos: Record<string, any> = {};
  for (const key of Object.keys(props.demos)) {
    demos[key.replace('/demos/', '')] = props.demos[key].default;
  }
  return demos;
});
const sourceArr = computed(() => sortDefaultDemoFile(props.source.split(',')));
const rawSourceArr = computed(() => sortDefaultDemoFile(props.rawSource.split(',')));

const index = ref(props.isFile ? 0 : filesPath.value.indexOf(defaultMutipleDemoFile));
const sourceCode = computed(() => sourceArr.value[index.value]);
const rawSourceCode = computed(() => rawSourceArr.value[index.value]);
const currentPath = computed(() => `${props.src}${!props.isFile ? `/${filesPath.value[index.value]}` : ''}`);
const exampleDemo = computed(() => formatPathDemos.value[!props.isFile ? `${props.src}/${defaultMutipleDemoFile}` : props.src]);
const { link: playgroundLink } = usePlayground(props.isFile ? filesPath.value[0] : defaultMutipleDemoFile, filesPath.value, rawSourceArr.value.map(s => decodeURIComponent(s)));
</script>

<template>
  <div class="vp-raw">
    <ClientOnly>
      <div class="example">
        <div class="description">
          <slot />
        </div>
        <Example :demo="exampleDemo" />
        <Code
          v-model="index"
          :source="sourceCode"
          :raw-source="rawSourceCode"
          :path="currentPath"
          :files="filesPath"
          :playground-link="playgroundLink"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="less" scoped>
.example {
  @apply border border-stone-200 rounded-lg;
}
.description{
  @apply my-2 px-4;
}
</style>
