<script setup lang="ts">
import { CdxButton } from '@cdx-component/components';
import { useBem, useModelValue } from '@cdx-component/hooks';
import { nextTick, ref } from 'vue';
import { textConvertEmits, textConvertProps } from './text-convert';

defineOptions({ name: 'CdxTextConvert' });
const props = defineProps(textConvertProps);
defineEmits(textConvertEmits);

const [, bem] = useBem('text-convert');

const { model } = useModelValue(props, '');
const canvasRef = ref<HTMLCanvasElement | null>(null);
const imageWidth = ref(100);
const imageHeight = ref(100);
const canvasReady = ref(false);

const calculateOptimalFontSize = (
  context: CanvasRenderingContext2D,
  text: string,
  canvasWidth: number,
  canvasHeight: number,
): number => {
  // set a initial font size base on canvas
  const initialFontSize = Math.min(canvasWidth * 2, canvasHeight * 2);

  let minFontSize = 1;
  let maxFontSize = initialFontSize;
  let resultFontSize = 1;

  const basePadding = Math.min(canvasWidth, canvasHeight) * 0.1;

  // binary search find the optimal font size
  while (minFontSize <= maxFontSize) {
    const fontSize = Math.floor((minFontSize + maxFontSize) / 2);
    context.font = `${fontSize}px Arial`;

    const metrics = context.measureText(text);
    const textWidth = metrics.width * 1.1;
    const textHeight = fontSize * 1.2;

    if (textWidth <= (canvasWidth - basePadding * 2) && textHeight <= (canvasHeight - basePadding * 2)) {
      resultFontSize = fontSize;
      minFontSize = fontSize + 1;
    }
    else {
      maxFontSize = fontSize - 1;
    }
  }
  return resultFontSize;
};

const renderEmoji = () => {
  if (!model.value.trim() || !canvasRef.value) return;

  const canvas = canvasRef.value;
  const context = canvas.getContext('2d');
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = imageWidth.value;
  canvas.height = imageHeight.value;

  const optimalFontSize = calculateOptimalFontSize(
    context,
    model.value,
    canvas.width,
    canvas.height,
  );
  context.font = `${optimalFontSize}px Arial`;

  const metrics = context.measureText(model.value);
  const textWidth = metrics.width;
  const x = (canvas.width - textWidth) / 2;
  const y = canvas.height / 2;
  context.textBaseline = 'middle';
  context.fillText(model.value, x, y);
};

const generateImage = async () => {
  if (!model.value.trim()) return;

  canvasReady.value = true;
  await nextTick();

  renderEmoji();
};

const downloadImage = () => {
  if (!canvasRef.value) return;

  const dataUrl = canvasRef.value.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `emoji-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div :class="bem.b()">
    <div :class="bem.be('input')">
      <h3 :class="bem.be('title')">
        文本转图片
      </h3>
      <div :class="bem.be('input-group')">
        <input
          v-model="model"
          :class="bem.be('input-main')"
          type="text"
          placeholder="输入文本"
        >
        <div :class="bem.be('control')">
          <div :class="bem.be('control-item')">
            <label>图片宽度:</label>
            <input
              v-model="imageWidth"
              type="number"
              min="10"
              max="1000"
            >
          </div>
          <div :class="bem.be('control-item')">
            <label>图片高度:</label>
            <input
              v-model="imageHeight"
              type="number"
              min="10"
              max="1000"
            >
          </div>
          <CdxButton :class="bem.be('generate-btn')" type="success" @click="generateImage">
            生成图片
          </CdxButton>
        </div>
      </div>
    </div>

    <div v-if="canvasReady" :class="bem.be('preview')">
      <h3 :class="bem.be('title')">
        预览
      </h3>
      <div :class="bem.be('preview-canvas')">
        <canvas ref="canvasRef" class="emoji-canvas" />
      </div>
      <div :class="bem.be('preview-actions')">
        <CdxButton :class="bem.be('download-btn')" type="success" @click="downloadImage">
          下载PNG
        </CdxButton>
      </div>
    </div>
  </div>
</template>
