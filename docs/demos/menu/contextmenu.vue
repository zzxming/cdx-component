<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const list = [
  {
    name: 'A',
    children: [
      { name: 'A-1' },
      { name: 'A-2' },
    ],
  },
  {
    name: 'break-1',
    type: 'break',
  },
  {
    name: 'B',
  },
  {
    name: 'break-2',
    type: 'break',
  },
  {
    name: 'C',
    children: [
      { name: 'C-1' },
      { name: 'C-2' },
    ],
  },
];
const visible = ref(false);
const x = ref(0);
const y = ref(0);

const hideContextmenu = () => {
  visible.value = false;
};
const contextmenuPosition = (e) => {
  if (!visible.value) {
    e.preventDefault();
  }
  visible.value = !visible.value;
  if (visible.value) {
    x.value = e.clientX;
    y.value = e.clientY;
  }
};
onMounted(() => {
  document.addEventListener('click', hideContextmenu);
  document.addEventListener('contextmenu', contextmenuPosition);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', hideContextmenu);
  document.removeEventListener('contextmenu', contextmenuPosition);
});
</script>

<template>
  <CdxMenu v-show="visible" :contextmenu="true" :x="x" :y="y">
    <CdxMenuItem
      v-for="item in list"
      :key="item.name"
      :type="item.type"
    >
      {{ item.name }}
      <template v-if="item.children" #children>
        <CdxMenuItem
          v-for="child in item.children"
          :key="child.name"
        >
          {{ child.name }}
        </CdxMenuItem>
      </template>
    </CdxMenuItem>
  </CdxMenu>
</template>
