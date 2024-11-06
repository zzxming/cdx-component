<template>
  <div style="height: 200px">
    <CdxScrollbar :min-size="100">
      <p v-for="item in 20" :key="item" style="height: 40px; margin: 8px 0px; border: 1px solid;">
        {{ item }}
      </p>
    </CdxScrollbar>
  </div>

  <div>
    <CdxScrollbar>
      <div style="display: flex;">
        <p v-for="item in 20" :key="item" style="width: 100px; height: 40px; flex-shrink: 0; margin: 8px 0px; border: 1px solid;">
          {{ item }}
        </p>
      </div>
    </CdxScrollbar>
  </div>
</template>
