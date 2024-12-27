<script setup>
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
</script>

<template>
  <CdxMenu>
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
