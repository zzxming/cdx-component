<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  src: string;
  demos: object;
  rawSource: string;
  source: string;
}>();

const formatPathDemos = computed(() => {
  const demos: Record<string, any> = {};
  for (const key of Object.keys(props.demos)) {
    demos[key.replace('/demos/', '').replace('.vue', '')] = props.demos[key].default;
  }
  return demos;
});
</script>

<template>
  <div class="vp-raw">
    <ClientOnly>
      <div class="example">
        <Example
          :file="src"
          :demo="formatPathDemos[src]"
        />
        <Code
          :source="source"
          :raw-source="rawSource"
          :path="src"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="less" scoped>
.example {
  @apply border border-stone-200 rounded-lg;
}
</style>
