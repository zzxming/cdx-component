<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue';
import type { TabItem } from './tabs';
import { useBem, useModelValue } from '@cdx-component/hooks';
import { capitalize } from '@cdx-component/utils';
import { computed, ref, watch } from 'vue';
import { tabsEmits, tabsProps } from './tabs';

defineOptions({ name: 'CdxTabs' });
const props = defineProps(tabsProps);
defineEmits(tabsEmits);

const [, bem] = useBem('tabs');
const { model } = useModelValue(props, 0);

const itemRefs = ref<Record<string, HTMLElement>>({});
const activeIndex = ref(0);

const itemTag = computed(() => props.router ? 'router-link' : 'span');
const tabHeaderBorderStyle = computed(() => {
  const sizeName = ['left', 'right'].includes(props.position) ? 'height' : 'width';
  const position = sizeName === 'width' ? 'left' : 'top';
  let offset = 0;
  let size = 0;
  let index = 0;
  for (const [, item] of Object.entries(itemRefs.value)) {
    if (index > activeIndex.value) break;
    switch (props.position) {
      case 'right':
      case 'left': {
        offset = item[`offset${capitalize(position)}`];
        size = item[`client${capitalize(sizeName)}`];
        if (sizeName === 'width') {
          const elStyle = window.getComputedStyle(item);
          if (props.tabs.length > 1) {
            size -= Number.parseFloat(elStyle.paddingLeft) + Number.parseFloat(elStyle.paddingRight);
          }
          offset += Number.parseFloat(elStyle.paddingLeft);
        }
        break;
      }
    }
    index += 1;
  }
  return {
    [sizeName]: `${size}px`,
    transform: `translate${sizeName === 'width' ? 'X' : 'Y'}(${offset}px)`,
  };
});

const setRef = (el: Element | ComponentPublicInstance | null, item: TabItem) => {
  if (el) {
    itemRefs.value[item.value] = el instanceof Element ? el : el.$el;
  }
  else {
    delete itemRefs.value[item.value];
  }
};
const routerAttrs = (item: TabItem) => {
  const attrs: Record<string, any> = {};
  if (props.router) {
    attrs.to = item.value;
  }
  return attrs;
};
const clickTabItem = (item: TabItem, index: number) => {
  model.value = item.value;
  activeIndex.value = index;
};

watch(() => model.value, () => {
  const index = props.tabs.findIndex(item => item.value === model.value);
  activeIndex.value = index !== -1 ? index : 0;
});
</script>

<template>
  <div :class="[bem.b(), bem.bm(position)]">
    <div :class="[bem.be('header'), bem.is(position, true)]">
      <cdx-only-child
        v-for="(item, index) in tabs"
        :key="item.value"
        :ref="(el: Element | ComponentPublicInstance | null) => setRef(el, item)"
      >
        <component
          :is="itemTag"
          :class="[bem.be('header-item'), bem.is(position, true), bem.is('active', activeIndex === index)]"
          v-bind="routerAttrs(item)"
          @click="clickTabItem(item, index)"
        >
          {{ item.label }}
        </component>
      </cdx-only-child>
      <div
        :class="[bem.be('header-underline'), bem.is(position, true)]"
        :style="tabHeaderBorderStyle"
      />
    </div>
    <div :class="bem.be('content')" flex-1 overflow-auto>
      <slot :tab="model" />
    </div>
  </div>
</template>
