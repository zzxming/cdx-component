<script lang="ts" setup>
import { useDynamicFormItem } from 'cdx-component';
import DynamicFormItem from './dynamic-form-item.vue';

const checboxSubItemA = useDynamicFormItem({
  name: 'input sub A',
  type: 'input',
  payload: {
    label: 'checkbox sub A',
    value: '',
  },
  sub: null,
  next: null,
});
const checboxSubItemB = useDynamicFormItem({
  name: 'input sub B',
  type: 'input',
  payload: {
    label: 'checkbox sub B',
    value: '',
  },
  sub: null,
  next: null,
});
const checkboxItem = useDynamicFormItem({
  name: 'input',
  type: 'checkbox',
  payload: {
    value: [],
    options: [
      {
        label: 'checkbox A',
        value: 'A',
      },
      {
        label: 'checkbox B',
        value: 'B',
      },
    ],
  },
  sub: (current) => {
    const map = {
      A: checboxSubItemA,
      B: checboxSubItemB,
    };
    console.log(
      current.payload.options
        .filter(({ value }) => current.payload.value.includes(value))
        .map(({ value }) => map[value]),
    );
    return current.payload.options
      .filter(({ value }) => current.payload.value.includes(value))
      .map(({ value }) => map[value]);
  },
  next: null,
});
const textItem = useDynamicFormItem({
  name: 'input',
  type: 'input',
  payload: {
    label: 'input text A',
    value: '',
  },
  sub: null,
  next: () => checkboxItem,
});
</script>

<template>
  <DynamicFormItem :item="textItem" />
</template>

<style lang="less" scoped></style>
