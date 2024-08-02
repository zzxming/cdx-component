<template>
  <div style="position: relative;height:  300px; ">
    <CdxTooltip text="top tip" directive="top">
      <button style="position: absolute; top: 0; left: 50%; transform: translate(-50%, 0);">
        hover
      </button>
    </CdxTooltip>
    <CdxTooltip text="right tip" directive="right">
      <button style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);">
        hover
      </button>
    </CdxTooltip>
    <CdxTooltip text="bottom tip" directive="bottom">
      <button style="position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 0);">
        hover
      </button>
    </CdxTooltip>
    <CdxTooltip text="left tip" directive="left">
      <button style="position: absolute; top:50%; left: 0; transform: translate(0, -50%);">
        hover
      </button>
    </CdxTooltip>
  </div>
</template>
