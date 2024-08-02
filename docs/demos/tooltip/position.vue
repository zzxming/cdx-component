<template>
  <div style="position: relative;height:  300px; ">
    <CdxTooltip text="top tip" direction="top">
      <button style="position: absolute; top: 0; left: 50%; transform: translate(-50%, 0);">
        hover
      </button>
    </CdxTooltip>
    <CdxTooltip text="right tip" direction="right">
      <button style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);">
        hover
      </button>
    </CdxTooltip>
    <CdxTooltip text="bottom tip" direction="bottom">
      <button style="position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 0);">
        hover
      </button>
    </CdxTooltip>
    <CdxTooltip text="left tip" direction="left">
      <button style="position: absolute; top:50%; left: 0; transform: translate(0, -50%);">
        hover
      </button>
    </CdxTooltip>
  </div>
</template>
