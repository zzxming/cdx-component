<script setup lang="ts">
import { useBem } from '@cdx-component/hooks';
import { nextTick, ref } from 'vue';
import { CdxButton } from '../../button';
import { textConvertEmits, textConvertProps } from './text-convert';

defineOptions({ name: 'CdxTextConvert' });
defineProps(textConvertProps);
defineEmits(textConvertEmits);

const [, bem] = useBem('text-convert');

const emojiText = ref('');
const canvasRef = ref<HTMLCanvasElement | null>(null);
const imageWidth = ref(100);
const imageHeight = ref(100);
const canvasReady = ref(false);

// 计算适合canvas的最佳字体大小，尽量占满整个画布
const calculateOptimalFontSize = (
  context: CanvasRenderingContext2D,
  text: string,
  canvasWidth: number,
  canvasHeight: number,
): number => {
  // 设置一个合理的起始字体大小，基于canvas尺寸
  const initialFontSize = Math.min(canvasWidth * 2, canvasHeight * 2);

  let minFontSize = 1;
  let maxFontSize = initialFontSize;
  let resultFontSize = 1;

  const basePadding = Math.min(canvasWidth, canvasHeight) * 0.1;

  // 创建一个二分查找算法来更快地找到最佳字体大小
  while (minFontSize <= maxFontSize) {
    const fontSize = Math.floor((minFontSize + maxFontSize) / 2);
    context.font = `${fontSize}px Arial`;

    const metrics = context.measureText(text);
    const textWidth = metrics.width * 1.1;
    const textHeight = fontSize * 1.2;

    // 检查文本是否适合canvas
    if (textWidth <= (canvasWidth - basePadding * 2) && textHeight <= (canvasHeight - basePadding * 2)) {
      // 文本适合，记录这个字体大小，然后尝试更大的字体
      resultFontSize = fontSize;
      minFontSize = fontSize + 1;
    }
    else {
      // 文本太大，尝试更小的字体
      maxFontSize = fontSize - 1;
    }
  }
  return resultFontSize;
};

const renderEmoji = () => {
  if (!emojiText.value.trim() || !canvasRef.value) return;

  const canvas = canvasRef.value;
  const context = canvas.getContext('2d');
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = imageWidth.value;
  canvas.height = imageHeight.value;

  const optimalFontSize = calculateOptimalFontSize(
    context,
    emojiText.value,
    canvas.width,
    canvas.height,
  );
  context.font = `${optimalFontSize}px Arial`;

  const metrics = context.measureText(emojiText.value);
  const textWidth = metrics.width;
  const x = (canvas.width - textWidth) / 2;
  const y = canvas.height / 2;
  context.textBaseline = 'middle';
  context.fillText(emojiText.value, x, y);
};

const generateImage = async () => {
  if (!emojiText.value.trim()) return;

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
    <div :class="bem.be('input-section')">
      <h3 :class="bem.be('title')">
        文本转图片
      </h3>
      <div :class="bem.be('input-group')">
        <input
          v-model="emojiText"
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
