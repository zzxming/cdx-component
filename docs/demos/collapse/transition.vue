<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(true);
const change = () => {
  show.value = !show.value;
};
</script>

<template>
  <button @click="change">
    change visiable
  </button>
  <CdxCollapseTransition>
    <p v-show="show">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, voluptatibus sed optio modi fuga
      distinctio sunt. Velit voluptas ex ratione dolorem, eos eius laudantium quas, quod, laboriosam voluptatem
      porro magnam?
    </p>
  </CdxCollapseTransition>
</template>
