<script lang="ts" setup>
import { computed, ref, toRef } from 'vue';
import { useDocBem, useGithubSource, usePlayground } from '../composables';

const props = defineProps<{
  modelValue: number;
  source: string;
  rawSource: string;
  path: string;
  files: string[];
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const [, bem] = useDocBem('example');

const isExpand = ref(false);

const exampleCodeText = computed(() => (isExpand.value ? '隐藏源代码' : '查看源代码'));
const code = computed(() => decodeURIComponent(props.source));
const rawCode = computed(() => decodeURIComponent(props.rawSource));

const { link } = usePlayground(rawCode.value);
const { url } = useGithubSource(toRef(props, 'path'));

const gotoPlayground = () => window.open(link);
const gotoGithub = () => window.open(url.value);
const copyCode = () => {
  const ta = document.createElement('textarea');
  ta.value = rawCode.value;
  ta.style.position = 'absolute';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
};
const toggleExpand = () => {
  isExpand.value = !isExpand.value;
};
</script>

<template>
  <div :class="bem.be('code')">
    <div :class="bem.be('actions')">
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
      <CdxIcon
        :class="bem.be('actions-btn')"
        title="复制代码"
        @click="copyCode"
      >
        <i-ic:baseline-content-copy />
      </CdxIcon>
      <CdxIcon
        :class="bem.be('actions-btn')"
        title="查看源代码"
        @click="toggleExpand"
      >
        <i-ic:baseline-data-object />
      </CdxIcon>
    </div>
    <CdxCollapseTransition>
      <div
        v-show="isExpand"
        :class="bem.be('code-wrapper')"
      >
        <div
          v-if="files.length > 1"
          :class="bem.be('code-list')"
        >
          <div
            v-for="(file, i) in files"
            :key="file"
            :class="[bem.be('code-file'), i === modelValue && bem.bem('code-file', 'active')]"
            plain
            @click="emit('update:modelValue', i)"
          >
            {{ file }}
          </div>
        </div>
        <div
          class="language-vue" :class="[bem.be('code-inner')]"
          v-html="code"
        />
      </div>
    </CdxCollapseTransition>
    <div
      v-show="isExpand"
      :class="bem.be('code-expand')"
      @click="toggleExpand"
    >
      {{ exampleCodeText }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.doc-example {
  &__actions {
    @apply flex items-center justify-end py-2 px-4 border-t;
    &-btn {
      color: var(--cdx-gray-4);
      @apply mx-1 cursor-pointer;
      &:hover {
        color: var(--cdx-gray-1);
      }
    }
  }
  &__code {
    &-list {
      background-color: var(--vp-code-block-bg);
      @apply flex items-center pb-2;
    }
    &-file {
      border: 2px solid transparent;
      @apply px-3 py-2 cursor-pointer;
      &:hover {
        background-color: var(--cdx-blue-opacity-1);
      }
      &--active {
        border-bottom-color: var(--cdx-blue-1);
      }
    }
    &-wrapper {
      @apply overflow-hidden;
    }
    &-expand {
      color: var(--cdx-gray-2);
      background-color: var(--vp-c-bg);
      @apply sticky bottom-0 z-10 w-full flex items-center justify-center p-2
              border-t cursor-pointer rounded-b-lg;
      &:hover {
        color: var(--cdx-blue-2);
      }
    }
  }
}
</style>
