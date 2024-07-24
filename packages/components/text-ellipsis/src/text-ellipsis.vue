<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import { namespace } from '@cdx-component/constants';
import { useBem, useModelValue } from '@cdx-component/hooks';
import { textEllipsisEmits, textEllipsisProps } from './text-ellipsis';
import { cloneNode } from './utils';

defineOptions({ name: 'CdxTextEllipsis' });
const props = defineProps(textEllipsisProps);
defineEmits(textEllipsisEmits);
const slots = useSlots();

const [, bem] = useBem('text-ellipsis');
const { model } = useModelValue(props, false);

const isEllipsis = ref(!!slots.default);
const text = ref('');
const rootRef = ref<HTMLDivElement>();

const hasExpandBtn = computed(() => props.canExpand && isEllipsis.value);
const expandBtnText = computed(() => (model.value ? props.collapseText : props.expandText));
const ellipsisLines = computed(() => (model.value ? 0 : props.lines));

const parseNum = (num: any) => {
  const n = Number.parseFloat(num);
  return Number.isNaN(n) ? 0 : n;
};
const calcEllipsisText = (root: HTMLElement, totalHeight: number, content: string) => {
  const len = content.length;
  // span 和文件间有换行, 不加这个空格可以把文字和 span 间的换行去掉
  const tailText = `${props.ellipsisText} ${hasExpandBtn.value ? expandBtnText.value : ''}`;
  const calcDisplay = (left: number, right: number): string => {
    if (right - left <= 1) {
      return content.slice(0, left) + props.ellipsisText;
    }
    const mid = Math.round((left + right) / 2);
    root.textContent = content.slice(0, mid) + tailText;
    return root.offsetHeight > totalHeight ? calcDisplay(left, mid) : calcDisplay(mid, right);
  };
  return calcDisplay(0, len);
};
const calcEllipsis = () => {
  if (!rootRef.value || !props.content) return;
  const copy = cloneNode(rootRef.value, props.content);
  const { paddingTop, paddingBottom, lineHeight } = getComputedStyle(copy);
  const totalHeight = parseNum(paddingTop) + parseNum(paddingBottom) + parseNum(lineHeight) * (Number(props.lines) + 0.5);

  if (copy.offsetHeight > totalHeight) {
    isEllipsis.value = true;
    text.value = calcEllipsisText(copy, totalHeight, props.content);
  }
  else {
    isEllipsis.value = false;
    text.value = props.content;
  }
  document.body.removeChild(copy);
};
const toggleExpand = () => {
  model.value = !model.value;
};

watch(
  () => [props.content, props.ellipsisText, props.expandText, props.collapseText],
  () => {
    calcEllipsis();
  },
);

onMounted(() => {
  if (props.content) {
    calcEllipsis();
    window.addEventListener('resize', calcEllipsis);
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', calcEllipsis);
});
</script>

<template>
  <div
    ref="rootRef"
    :class="bem.b()"
    :style="{ [`--${namespace}-line`]: ellipsisLines }"
  >
    <span :class="[$slots.default && bem.bem('content', 'block')]">
      <slot
        :is-expanded="model"
        :text="model ? props.content : text"
      >
        {{ model ? props.content : text }}
      </slot>
    </span>
    <span
      v-if="hasExpandBtn"
      :class="bem.be('expand-btn')"
      @click="toggleExpand"
    >
      <slot
        name="expandBtn"
        :is-expanded="model"
      >
        {{ expandBtnText }}
      </slot>
    </span>
  </div>
</template>
