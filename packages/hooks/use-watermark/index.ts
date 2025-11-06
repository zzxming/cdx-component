import type { CSSProperties, Ref, UnwrapRef } from 'vue';
import { isArray, isUndefined } from '@cdx-component/utils';
import { useMutationObserver } from '@vueuse/core';
import { computed, onMounted, ref, watch } from 'vue';
import { getClips } from './clip';

export interface ContentFont {
  color: string;
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  fontGap: number;
  textAlign: 'start' | 'end' | 'left' | 'right' | 'center';
  textBaseline: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
}
export interface WatermarkOptions {
  content?: Ref<string | string[]>;
  image?: Ref<string>;
  width?: Ref<number>;
  height?: Ref<number>;
  rotate: Ref<number>;
  zIndex: Ref<number>;
  // gap between watermarks
  gap: Ref<[number, number]>;
  // offset from top-left corner
  offset: Ref<[number, number]>;
  font: Partial<ContentFont>;
}

export function toLowercaseSeparator(key: string) {
  return key.replaceAll(/([A-Z])/g, '-$1').toLowerCase();
}

export function getStyleStr(style: CSSProperties): string {
  return Object.keys(style)
    .map(key => `${toLowercaseSeparator(key)}: ${style[key as keyof CSSProperties]};`)
    .join(' ');
}

export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}
export const useWatermark = (el: Ref<HTMLElement | undefined>, options: Partial<WatermarkOptions>) => {
  const containerRef = ref<HTMLElement>();
  const watermarkRef = ref<HTMLElement>();
  const stopObservation = ref(false);
  const content = computed(() => options.content?.value);
  const image = computed(() => options.image?.value);
  const width = computed(() => options.width?.value || 120);
  const height = computed(() => options.height?.value || 64);
  const rotate = computed(() => options.rotate?.value || -22);
  const zIndex = computed(() => options.zIndex?.value || 10);
  const gapX = computed(() => options.gap?.value[0] || 100);
  const gapY = computed(() => options.gap?.value[1] || 100);
  const gapXCenter = computed(() => gapX.value / 2);
  const gapYCenter = computed(() => gapY.value / 2);
  const offsetLeft = computed(() => options.offset?.value[0] ?? gapXCenter.value);
  const offsetTop = computed(() => options.offset?.value[1] ?? gapYCenter.value);
  const fontOptions = computed<ContentFont>(() => {
    const defaultFont: ContentFont = {
      color: 'rgba(0,0,0,.15)',
      fontSize: 16,
      fontWeight: 'normal',
      fontFamily: 'sans-serif',
      fontGap: 3,
      textAlign: 'center',
      textBaseline: 'alphabetic',
    };
    return { ...defaultFont, ...options.font };
  });

  const getMarkStyle = () => {
    const markStyle: CSSProperties = {
      zIndex: zIndex.value,
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      backgroundRepeat: 'repeat',
    };

    let positionLeft = offsetLeft.value - gapXCenter.value;
    let positionTop = offsetTop.value - gapYCenter.value;
    if (positionLeft > 0) {
      markStyle.left = `${positionLeft}px`;
      markStyle.width = `calc(100% - ${positionLeft}px)`;
      positionLeft = 0;
    }
    if (positionTop > 0) {
      markStyle.top = `${positionTop}px`;
      markStyle.height = `calc(100% - ${positionTop}px)`;
      positionTop = 0;
    }
    markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;

    return markStyle;
  };

  const appendWatermark = (base64Url: string, markWidth: number) => {
    if (containerRef.value && watermarkRef.value) {
      stopObservation.value = true;
      watermarkRef.value.setAttribute(
        'style',
        getStyleStr({
          ...getMarkStyle(),
          backgroundImage: `url('${base64Url}')`,
          backgroundSize: `${Math.floor(markWidth)}px`,
        }),
      );
      containerRef.value?.append(watermarkRef.value);
      setTimeout(() => {
        stopObservation.value = false;
      });
    }
  };

  const validateWatermark = (
    mutation: MutationRecord,
    watermarkElement?: HTMLElement,
  ) => {
    let flag = false;
    if (mutation.removedNodes.length > 0 && watermarkElement) {
      flag = Array.from(mutation.removedNodes).includes(watermarkElement);
    }
    if (mutation.type === 'attributes' && mutation.target === watermarkElement) {
      flag = true;
    }
    return flag;
  };

  const destroyWatermark = () => {
    if (watermarkRef.value) {
      watermarkRef.value.remove();
      watermarkRef.value = undefined;
    }
  };

  const getMarkSize = (ctx: CanvasRenderingContext2D) => {
    let defaultWidth = width.value;
    let defaultHeight = height.value;
    let space = 0;

    if (!image.value && ctx.measureText) {
      ctx.font = `${Number(fontOptions.value.fontSize)}px ${fontOptions.value.fontFamily}`;

      const contents = isArray(content.value) ? content.value : [content.value];
      let maxWidth = 0;
      let maxHeight = 0;
      for (const item of contents) {
        const {
          width,
          fontBoundingBoxAscent,
          fontBoundingBoxDescent,
          actualBoundingBoxAscent,
          actualBoundingBoxDescent,
        } = ctx.measureText(item!);
        // Using `actualBoundingBoxAscent` to be compatible with lower version browsers (eg: Firefox < 116)
        const height = isUndefined(fontBoundingBoxAscent)
          ? actualBoundingBoxAscent + actualBoundingBoxDescent
          : fontBoundingBoxAscent + fontBoundingBoxDescent;

        if (width > maxWidth) maxWidth = Math.ceil(width);
        if (height > maxHeight) maxHeight = Math.ceil(height);
      }

      defaultWidth = maxWidth;
      defaultHeight = maxHeight * contents.length + (contents.length - 1) * fontOptions.value.fontGap;

      const angle = (Math.PI / 180) * Number(rotate.value);
      space = Math.ceil(Math.abs(Math.sin(angle) * defaultHeight) / 2);

      defaultWidth += space;
    }

    return [defaultWidth, defaultHeight, space] as const;
  };

  const renderWatermark = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (!watermarkRef.value) {
        watermarkRef.value = document.createElement('div');
      }

      const ratio = getPixelRatio();
      const [markWidth, markHeight, space] = getMarkSize(ctx);

      const drawCanvas = (drawContent?: UnwrapRef<WatermarkOptions['content']> | HTMLImageElement) => {
        const [textClips, clipWidth] = getClips(
          drawContent || '',
          rotate.value,
          ratio,
          markWidth,
          markHeight,
          fontOptions.value,
          gapX.value,
          gapY.value,
          space,
        );
        appendWatermark(textClips, clipWidth);
      };

      if (image?.value) {
        const img = new Image();
        img.addEventListener('load', () => {
          drawCanvas(img);
        });
        img.addEventListener('error', () => {
          drawCanvas(content.value);
        });
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.src = image.value;
      }
      else {
        drawCanvas(content.value);
      }
    }
  };

  const onMutate = (mutations: MutationRecord[]) => {
    if (stopObservation.value) {
      return;
    }
    for (const mutation of mutations) {
      if (validateWatermark(mutation, watermarkRef.value)) {
        destroyWatermark();
        renderWatermark();
      }
    }
  };

  useMutationObserver(containerRef, onMutate, {
    attributes: true,
    subtree: true,
    childList: true,
  });

  onMounted(() => {
    if (el.value) {
      containerRef.value = document.createElement('div');
      containerRef.value.style.position = 'relative';
      const parent = el.value.parentNode;
      parent?.insertBefore(containerRef.value, el.value);
      containerRef.value.appendChild(el.value);
    }
  });

  watch(
    () => [options, el.value],
    renderWatermark,
    {
      deep: true,
      flush: 'post',
    },
  );
};
