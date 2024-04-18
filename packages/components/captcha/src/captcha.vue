<script setup lang="ts">
import { isFunction, isBoolean, generateRandomColor } from '@cdx-component/utils';
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { captchaProps, CheckStatus, captchaEmits, CaptchType } from './captcha';
import { squarePath } from './canvasPath';
import { CdxLoading, CdxCaptchaSlider } from '@cdx-component/components';
import { useBem } from '@cdx-component/hooks';
import { CdxCaptchaSliderExposed, Range } from './types';

defineOptions({ name: 'CdxCaptcha' });
const props = defineProps(captchaProps);
const emits = defineEmits(captchaEmits);

const getSlideTarget = () => {
    return [Math.random() * 50 + 25, Math.random() * 50 + 25];
};
const [, bem] = useBem('captcha');

const canvasRef = ref<HTMLCanvasElement>();
const subCanvasRef = ref<HTMLCanvasElement>();
const sliderRef = ref<CdxCaptchaSliderExposed>();

const pointerTargets: number[][] = [];
const pointers = ref<number[][]>([]);
const checkTip = ref('');
const checkStatus = ref(CheckStatus.none);
const checkTipVisible = ref(false);
const imageLoading = ref(true);
const vertifyLoading = ref(false);
const refreshLoading = ref(false);
const slideTarget = ref(getSlideTarget());
const imageLoadFailed = ref(false);

const trackRef = computed(() => sliderRef.value?.trackRef);
const currentX = computed(() => sliderRef.value?.currentX);
const isLoading = computed(() => props.loading || imageLoading.value || vertifyLoading.value || refreshLoading.value);
const isLock = computed(() => checkStatus.value === CheckStatus.success || isLoading.value || imageLoadFailed.value);
const subCanvasStyle = computed(() => ({
    [bem.cv('captcha-sub-image-transition')]: sliderRef.value?.resetting ? 'left 250ms ease' : 'left 0ms ease',
    left: `${currentX.value}%`,
}));

watch([() => props.texts, () => props.image, () => props.type], () => {
    reset();
});

const cancelPointer = (i: number) => {
    if (isLock.value) return;
    pointers.value = pointers.value.slice(0, i);
};
const verifyPointers = () => {
    if (!canvasRef.value) return;

    const { width, height } = canvasRef.value;
    const fontSize = Math.max(width, height) * props.fontRate;

    const xTolerance = (fontSize / width) * 50;
    const yTolerance = (fontSize / height) * 50;
    let result = true;
    for (let i = 0, len = pointers.value.length; i < len; ++i) {
        const [x, y] = pointers.value[i];
        const [targetX, targetY] = pointerTargets[i];
        if (Math.abs(x - targetX) > xTolerance || Math.abs(y - targetY) > yTolerance) {
            result = false;
            break;
        }
    }
    return result;
};
const formatBeforeSuccess = async () => {
    vertifyLoading.value = true;
    let isSuccess = false;
    let message = undefined;
    const result = await props.onBeforSuccess!();
    if (isBoolean(result)) {
        isSuccess = result;
    } else {
        isSuccess = !!result.success;
        message = result.message;
    }
    vertifyLoading.value = false;

    return {
        isSuccess,
        message,
    };
};
const checkedFail = (message: string = '验证失败，请重试') => {
    checkTip.value = message;
    checkStatus.value = CheckStatus.fail;
    pointers.value = [];
    emits('fail');
    checkTipVisible.value = true;
    setTimeout(() => {
        checkTipVisible.value = false;
    }, props.tipDuration);
};
const checkedSuccess = (message: string = '验证成功') => {
    checkTip.value = message;
    checkStatus.value = CheckStatus.success;
    checkTipVisible.value = true;
    emits('success');
    setTimeout(() => {
        checkTipVisible.value = false;
    }, props.tipDuration);
};
const loadImage = async (imageSrc: string) => {
    imageLoading.value = true;
    return await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = (e) => {
            console.log(e);
            reject(new Error('图片加载失败'));
            imageLoadFailed.value = true;
            emits('imgError');
        };
        img.src = imageSrc;
    }).finally(() => {
        imageLoading.value = false;
    });
};
const drawText = (ctx: CanvasRenderingContext2D, { width, height }: Range) => {
    if (!props.texts?.length) return;
    const fontSize = Math.max(width, height) * props.fontRate;

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';

    const drawTextOnCanvas = (text: string, x: number, y: number, radian = 0, color = generateRandomColor()) => {
        ctx.save();
        ctx.translate(x, y);
        radian && ctx.rotate(radian * Math.PI);
        ctx.fillStyle = color;
        ctx.fillText(text, 0, 0);
        ctx.strokeText(text, 0, 0);
        ctx.restore();
    };

    const metrics = ctx.measureText(props.texts[0]);
    const xLimit = Math.max(fontSize, metrics.width) * 1.2;
    const yLimit = Math.max(fontSize, metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent) * 1.2;

    let prevX = -2 * fontSize;
    let prevY = -2 * fontSize;
    for (const text of props.texts) {
        let x = prevX;
        let y = prevY;

        while (Math.abs(x - prevX) < xLimit && Math.abs(y - prevY) < yLimit) {
            x = width * 0.1 + Math.random() * width * 0.8;
            y = height * 0.1 + Math.random() * height * 0.8;
        }

        prevX = x;
        prevY = y;

        pointerTargets.push([(x / width) * 100, (y / height) * 100]);
        drawTextOnCanvas(text, x, y, Math.random() * 2);
    }
};
const drawImage = async (imageSrc: string, canvasEl?: HTMLCanvasElement) => {
    const image = await loadImage(imageSrc);
    if (!image || !canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvasEl;
    ctx.drawImage(image, 0, 0, width, height);
    if (props.type === CaptchType.pointer) {
        return drawText(ctx, { width, height });
    }

    const subCanvasEl = subCanvasRef.value;
    const subCtx = subCanvasEl?.getContext?.('2d');
    if (!subCanvasEl || !subCtx || !trackRef.value) return;
    if (props.type === CaptchType.slider) {
        const canvasRect = canvasEl.getBoundingClientRect();
        const trackRect = trackRef.value.getBoundingClientRect();
        // 滑动时以轨道为准, 需要补正 canvas 宽度和 track 宽度的差值
        const widthFix = ((canvasRect.width - trackRect.width) / canvasRect.width) * canvasEl.width;

        const targetX = widthFix / 2 + slideTarget.value[0] * (canvasEl.width - widthFix) * 0.01;
        const targetY = slideTarget.value[1] * canvasEl.height * 0.01;

        const pathCanvas = document.createElement('canvas');
        pathCanvas.width = canvasEl.width;
        pathCanvas.height = canvasEl.height;
        const pathCtx = pathCanvas.getContext('2d');
        if (!pathCtx) return;
        pathCtx.drawImage(image, 0, 0, width, height);
        pathCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        pathCtx.lineWidth = 4;
        const [clipX, clipY, clipWidth, clipHeight] = squarePath({
            ctx: pathCtx,
            x: targetX,
            y: targetY,
            width: props.canvasSize[0],
            height: props.canvasSize[1],
        });
        // 中心点偏移修正
        const xLeftWidth = targetX - clipX;
        const translateFix = ((clipWidth * 0.5 - xLeftWidth) / clipWidth) * 100;

        subCanvasEl.style.transform = `translate3d(${translateFix - 50}%, 0, 0)`;

        subCanvasEl.width = clipWidth;
        subCtx.drawImage(pathCanvas, clipX, clipY, clipWidth, clipHeight, 0, clipY, clipWidth, clipHeight);

        ctx.save();
        ctx.beginPath();
        squarePath({
            ctx: ctx,
            x: targetX,
            y: targetY,
            width: props.canvasSize[0],
            height: props.canvasSize[1],
        });
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.fill();
    }
};
const handleRefresh = async () => {
    if (isLoading.value || checkStatus.value === CheckStatus.success) return;
    pointerTargets.splice(0, pointerTargets.length);
    pointers.value = [];
    slideTarget.value = getSlideTarget();
    checkStatus.value = CheckStatus.none;
    checkTipVisible.value = false;
    refreshLoading.value = true;
    isFunction(props.onRefresh) && (await props.onRefresh());
    await nextTick();
    refreshLoading.value = false;
};
const handlePointerSetClick = async (e: MouseEvent) => {
    if (props.type !== CaptchType.pointer || !canvasRef.value || !pointerTargets.length || isLock.value) return;
    const { offsetX, offsetY } = e;
    const { clientWidth: width, clientHeight: height } = canvasRef.value;
    pointers.value.push([(offsetX / width) * 100, (offsetY / height) * 100]);
    if (pointers.value.length >= pointerTargets.length) {
        if (verifyPointers()) {
            if (props.onBeforSuccess) {
                vertifyLoading.value = true;
                const { isSuccess, message } = await formatBeforeSuccess();
                isSuccess ? checkedSuccess(message) : checkedFail(message);
            } else {
                checkedSuccess();
            }
        } else {
            checkedFail();
        }
    }
};
const handleSliderSuccess = async () => {
    if (props.onBeforSuccess) {
        const { isSuccess, message } = await formatBeforeSuccess();
        if (isSuccess) {
            checkedSuccess(message);
        } else {
            checkedFail(message);
            sliderRef.value?.reset();
        }
    } else {
        checkedSuccess();
    }
};
const handleSliderFail = () => {
    checkedFail();
};

onMounted(() => {
    drawImage(props.image, canvasRef.value);
});

const reset = () => {
    pointerTargets.length = 0;
    pointers.value = [];
    checkStatus.value = CheckStatus.none;
    checkTipVisible.value = false;
    vertifyLoading.value = false;
    refreshLoading.value = false;
    slideTarget.value = getSlideTarget();
    imageLoadFailed.value = false;

    sliderRef.value && sliderRef.value.reset();
    drawImage(props.image, canvasRef.value);
};
</script>

<template>
    <div :class="bem.b()">
        <div :class="bem.be('header')">
            <button
                :class="[bem.bs('refresh'), (checkStatus === CheckStatus.success || isLoading) && bem.bm('disabled')]"
                @click="handleRefresh"
            >
                <slot name="refresh">刷新</slot>
            </button>
        </div>
        <div
            :class="[
                bem.be('container'),
                isLock && bem.bem('container', 'lock'),
                type === CaptchType.pointer && bem.bs('pointer'),
            ]"
            @click="handlePointerSetClick"
        >
            <template v-if="image">
                <canvas
                    :class="bem.be('canvas')"
                    ref="canvasRef"
                    :width="canvasSize[0]"
                    :height="canvasSize[1]"
                ></canvas>
                <div
                    v-if="type === CaptchType.slider"
                    :class="bem.be('sub-image')"
                >
                    <canvas
                        ref="subCanvasRef"
                        :class="bem.be('sub-canvas')"
                        :height="canvasSize[1]"
                        :style="subCanvasStyle"
                    ></canvas>
                </div>
            </template>
            <template v-if="type === CaptchType.pointer">
                <span
                    v-for="([x, y], i) in pointers"
                    :class="bem.be('pointer')"
                    :style="{ top: `${y}%`, left: `${x}%` }"
                    @click.stop="() => cancelPointer(i)"
                >
                    {{ i + 1 }}
                </span>
            </template>
            <Transition
                appear
                :name="bem.ns('fade')"
                v-show="checkTipVisible"
            >
                <div :class="[bem.be('tip'), bem.bem('tip', checkStatus), 'btt']">
                    <span :class="bem.be('tip-text')">
                        {{ checkTip }}
                    </span>
                </div>
            </Transition>
            <CdxLoading :visible="isLoading"></CdxLoading>
        </div>
        <div :class="bem.be('footer')">
            <div
                v-if="type === CaptchType.pointer"
                :class="bem.be('text-list')"
            >
                <span :class="bem.be('tip')">请依次点击：</span>
                <span
                    v-for="s in texts"
                    :class="bem.bem('tip-text', 'blod')"
                >
                    {{ s }}
                </span>
            </div>
            <CdxCaptchaSlider
                v-else-if="type === CaptchType.slider"
                ref="sliderRef"
                :lock="isLock"
                :loading="isLoading"
                :target="slideTarget[0]"
                @success="handleSliderSuccess"
                @fail="handleSliderFail"
            ></CdxCaptchaSlider>
        </div>
    </div>
</template>
