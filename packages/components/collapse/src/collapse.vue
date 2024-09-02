<script setup lang="ts">
import { provide } from 'vue';
import { useBem, useModelValue } from '@cdx-component/hooks';
import { CHANGE_EVENT } from '@cdx-component/constants';
import type { CollapseModelValueType } from './collapse';
import { collapseEmits, collapseProps } from './collapse';
import { collapseContextKey } from './constants';

defineOptions({ name: 'CdxCollapse' });
const props = defineProps(collapseProps);
const emits = defineEmits(collapseEmits);

const [, bem] = useBem('collapse');

const { model } = useModelValue(props, []);

const handleItemClick = (name: CollapseModelValueType) => {
  const _activeNames = [...model.value];
  const index = _activeNames.indexOf(name);

  if (index > -1) {
    _activeNames.splice(index, 1);
  }
  else {
    if (props.isSolo) {
      _activeNames.splice(0, _activeNames.length, name);
    }
    else {
      _activeNames.push(name);
    }
  }

  model.value = _activeNames;
  emits(CHANGE_EVENT, _activeNames);
};

provide(collapseContextKey, {
  activeNames: model,
  handleItemClick,
});
</script>

<template>
  <div :class="bem.b()">
    <slot />
  </div>
</template>
