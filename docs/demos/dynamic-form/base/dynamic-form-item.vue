<script lang="ts" setup>
import type { IFormItem } from 'cdx-component';
import { getNextFormItem, getSubFormItem } from 'cdx-component';
import { computed } from 'vue';

const props = defineProps<{
  item: IFormItem | null;
}>();
const subs = computed(() => getSubFormItem(props.item));

const handleCheckboxChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.checked) {
    props.item!.payload.value.push(input.value);
  }
  else {
    const i = props.item!.payload.value.indexOf(input.value);
    props.item!.payload.value.splice(i, 1);
  }
};
</script>

<template>
  <template v-if="item">
    <div
      v-if="item.type === 'input'"
      class="item"
      v-bind="item.prop"
    >
      <label>
        <span class="item-label">{{ item.payload.label }}</span>
        <input v-model="item.payload.value" type="text">
      </label>
      <div v-if="subs" class="sub">
        <dynamic-form-item
          v-for="subItem in subs"
          :key="subItem.name"
          :item="subItem"
        />
      </div>
    </div>
    <div
      v-if="item.type === 'checkbox'"
      class="item"
      v-bind="item.prop"
    >
      <label v-for="option in item.payload.options" :key="option.value">
        <span class="item-label">{{ option.label }}</span>
        <input type="checkbox" :name="item.payload.value" :value="option.value" @change="handleCheckboxChange">
      </label>
      <div v-if="subs" class="sub">
        <dynamic-form-item
          v-for="subItem in subs"
          :key="subItem.name"
          :item="subItem"
        />
      </div>
    </div>

    <dynamic-form-item :item="getNextFormItem(item)" />
  </template>
</template>

<style scoped>
input {
  margin-left: 6px;
}
input[type='text'] {
  border: 1px solid;
}
.item {
  margin-top: 4px;
}
.sub {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 20px;
}
</style>
