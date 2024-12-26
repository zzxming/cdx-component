<script setup lang="ts">
import type { MenuItemSlots } from './menu-item';
import { CdxIcon } from '@cdx-component/components';
import { useBem, useForwardRef, useTeleportContainer } from '@cdx-component/hooks';
import { computed, ref } from 'vue';
import { menuItemProps } from './menu-item';

defineOptions({ name: 'CdxMenuItem' });
const props = defineProps(menuItemProps);
const slots = defineSlots<MenuItemSlots>();

const [, bem] = useBem('menu');
const { selector } = useTeleportContainer(bem.be('container'));
const triggerRef = ref<HTMLElement>();
useForwardRef(triggerRef);

const isHover = ref(false);

const isBreak = computed(() => props.type === 'break');

const handleMouseEnter = () => {
  isHover.value = true;
};
const handleMouseLeave = () => {
  isHover.value = false;
};
const childrenDisplayHandler = {
  mouseenter: handleMouseEnter,
  mouseleave: handleMouseLeave,
};
</script>

<template>
  <div :class="[bem.be('item'), bem.is('break', isBreak)]" v-on="childrenDisplayHandler">
    <template v-if="!isBreak">
      <slot />

      <CdxIcon v-if="slots.children" :class="bem.is('arrow', true)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </CdxIcon>
    </template>
  </div>
  <template v-if="slots.children">
    <Teleport :to="selector">
      <Transition :name="bem.ns('fade')">
        <CdxMenu
          v-if="isHover"
          v-on="childrenDisplayHandler"
        >
          <slot name="children" />
        </CdxMenu>
      </Transition>
    </Teleport>
  </template>
</template>
