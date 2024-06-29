<script lang="ts" setup>
import { ref } from 'vue';

type Direction = 'top' | 'right' | 'bottom' | 'left';
const directionMap: Direction[] = ['top', 'right', 'bottom', 'left'];
const show = ref(false);
const direction = ref<Direction>(directionMap[3]);
</script>

<template>
  <div>
    <label
      v-for="d in directionMap"
      :key="d"
      style="margin-right: 4px"
    >
      <input
        v-model="direction"
        type="radio"
        :value="d"
      >
      {{ d }}
    </label>
  </div>
  <CdxDrawer
    v-model="show"
    :direction="direction"
  >
    <template #swipe>
      <div class="swipe_content">
        向 {{ direction }} 滑动
      </div>
    </template>
    <div>drawer content</div>
  </CdxDrawer>
</template>

<style scoped>
.swipe_content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
}
</style>
