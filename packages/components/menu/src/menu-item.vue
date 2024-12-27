<script setup lang="ts">
import type { MenuItemSlots } from './menu-item';
import { CdxIcon } from '@cdx-component/components';
import { useBem, useForwardRef, useTeleportContainer, useTimeout } from '@cdx-component/hooks';
import { computed, inject, provide, ref } from 'vue';
import { menuContextKey } from './constants';
import CdxMenu from './menu.vue';
import { menuItemProps } from './menu-item';

defineOptions({ name: 'CdxMenuItem' });
const props = defineProps(menuItemProps);
const slots = defineSlots<MenuItemSlots>();

const [, bem] = useBem('menu');
const { selector } = useTeleportContainer(bem.be('container'));
const { startTimeout, clearTimeout } = useTimeout();
const triggerRef = ref<HTMLElement>();
useForwardRef(triggerRef);

const menuItemRef = ref<HTMLElement>();
const isHover = ref(false);
const isDisplayChildren = ref(false);
const childrenMenuX = ref(0);
const childrenMenuY = ref(0);

const isBreak = computed(() => props.type === 'break');

const handleMouseEnter = () => {
  clearTimeout();
  if (menuItemRef.value) {
    const rect = menuItemRef.value.getBoundingClientRect();
    childrenMenuX.value = rect.left + rect.width;
    childrenMenuY.value = rect.top;
  }
  isHover.value = true;
  isDisplayChildren.value = true;
};
const handleMouseLeave = () => {
  clearTimeout();
  isHover.value = false;
  startTimeout(() => {
    isDisplayChildren.value = false;
  }, 150);
};
const childrenDisplayHandler = {
  mouseenter: handleMouseEnter,
  mouseleave: handleMouseLeave,
};

const menuContext = inject(menuContextKey);
provide(menuContextKey, {
  width: menuContext?.width || ref(200),
  menuItemRef,
});
</script>

<template>
  <div
    ref="menuItemRef"
    :class="[bem.be('item'), bem.is('break', isBreak), bem.is('open', isHover)]"
    v-bind="$attrs"
    v-on="childrenDisplayHandler"
  >
    <template v-if="!isBreak">
      <slot />

      <CdxIcon v-if="slots.children" :class="bem.is('arrow', true)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </CdxIcon>
    </template>
  </div>
  <template v-if="slots.children">
    <Teleport :to="selector">
      <CdxMenu
        :visible="isDisplayChildren"
        :contextmenu="true"
        :x="childrenMenuX"
        :y="childrenMenuY"
        v-on="childrenDisplayHandler"
      >
        <slot name="children" />
      </CdxMenu>
    </Teleport>
  </template>
</template>
