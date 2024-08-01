<template>
  <div style="position: relative;height:  300px; ">
    <button v-tooltip:top="'top tooltip'" style="border: 1px solid; position: absolute; top: 0; left: 50%; transform: translate(-50%, 0);">
      hover
    </button>
    <button v-tooltip:right="'right tooltip'" style="border: 1px solid; position: absolute; top: 50%; right: 0; transform: translate(0, -50%);">
      hover
    </button>
    <button v-tooltip:bottom="'bottom tooltip'" style="border: 1px solid; position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 0);">
      hover
    </button>
    <button v-tooltip:left="'left tooltip'" style="border: 1px solid; position: absolute; top:50%; left: 0; transform: translate(0, -50%);">
      hover
    </button>
  </div>
</template>
