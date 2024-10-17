<script lang="ts" setup>
import { computed, ref } from 'vue';

const props = defineProps<{
  src: string;
  demos: object;
  rawSource: string;
  source: string;
  files: string;
  isFile: boolean;
}>();
console.log(props);
const filesPath = computed(() => props.files.split(','));
const index = ref(0);
const formatPathDemos = computed(() => {
  const demos: Record<string, any> = {};
  for (const key of Object.keys(props.demos)) {
    demos[key.replace('/demos/', '').replace('.vue', '')] = props.demos[key].default;
  }
  return demos;
});
const sourceArr = computed(() => props.source.split(','));
const rawSourceArr = computed(() => props.rawSource.split(','));
const sourceCode = computed(() => sourceArr.value[index.value]);
const rawSourceCode = computed(() => rawSourceArr.value[index.value]);
const exampleDemo = computed(() => {
  if (props.isFile) return formatPathDemos.value[props.src];
  return formatPathDemos.value[`${props.src}/index`];
});
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
          :path="src"
          :files="filesPath"
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
