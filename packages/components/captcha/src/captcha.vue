<script setup lang="ts">
import { isFunction, isBoolean, generateRandomColor } from '@cdx-component/utils';
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { captchaProps, CheckStatus, captchaEmits } from './captcha';
import { CdxLoading } from '@cdx-component/components';

const props = defineProps(captchaProps);
const emits = defineEmits(captchaEmits);

const canvasRef = ref<HTMLCanvasElement>();

const pointerTargets: number[][] = [];
const pointers = ref<number[][]>([]);
const checkTip = ref('');
const checkStatus = ref(CheckStatus.none);
const checkTipVisible = ref(false);
const imageLoading = ref(true);
const vertifyLoading = ref(false);
const refreshLoading = ref(false);

const isLoading = computed(() => props.loading || imageLoading.value || vertifyLoading.value || refreshLoading.value);
const isLock = computed(() => checkStatus.value === CheckStatus.success || isLoading.value);

watch(isLoading, () => {
    emits('update:loading', isLoading.value);
});
watch([() => props.image, () => props.texts], async () => {
    await nextTick();
    drawImage(props.image, canvasRef.value);
});

const checkFail = (message: string = '验证失败，请重试') => {
    checkTip.value = message;
    checkStatus.value = CheckStatus.fail;
    pointers.value = [];
    emits('fail');
    checkTipVisible.value = true;
    setTimeout(() => {
        checkTipVisible.value = false;
    }, props.tipDuration);
};
const checkSuccess = (message: string = '验证成功') => {
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
            emits('error');
        };
        img.src = imageSrc;
    }).finally(() => {
        imageLoading.value = false;
    });
};
const drawImage = async (imageSrc: string, canvasEl?: HTMLCanvasElement) => {
    const image = await loadImage(imageSrc);
    if (image && canvasEl) {
        const ctx = canvasEl.getContext('2d');
        if (ctx) {
            const { width, height } = canvasEl;
            ctx.drawImage(image, 0, 0, width, height);
            drawText(ctx, { width, height });
        }
    }
};
const drawText = (ctx: CanvasRenderingContext2D, { width, height }: { width: number; height: number }) => {
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
const handlePointerSetClick = async (e: MouseEvent) => {
    if (!canvasRef.value || !pointerTargets.length || isLock.value) return;
    const { offsetX, offsetY } = e;
    const { clientWidth: width, clientHeight: height } = canvasRef.value;
    pointers.value.push([(offsetX / width) * 100, (offsetY / height) * 100]);
    if (pointers.value.length >= pointerTargets.length) {
        if (verifyPointers()) {
            if (props.onBeforSuccess) {
                vertifyLoading.value = true;
                const result = await props.onBeforSuccess();
                if (isBoolean(result)) {
                    result ? checkSuccess() : checkFail();
                } else if (!result.success) {
                    checkFail(result.message);
                } else {
                    checkSuccess((!isBoolean(result) && result.message) || undefined);
                }
                vertifyLoading.value = false;
            } else {
                checkSuccess();
            }
        } else {
            checkFail();
        }
    }
};
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

const handleRefresh = async () => {
    if (isLoading.value) return;
    pointerTargets.splice(0, pointerTargets.length);
    pointers.value = [];
    checkStatus.value = CheckStatus.none;
    checkTipVisible.value = false;
    refreshLoading.value = true;
    isFunction(props.refresh) && (await props.refresh());
    await nextTick();
    refreshLoading.value = false;
};

onMounted(() => {
    drawImage(props.image, canvasRef.value);
});
</script>

<template>
    <div class="captcha">
        <div class="captcha_header">
            <span class="captcha_tip">请在下图依次点击：</span>
            <span
                v-for="s in texts"
                class="captcha_tip-text"
            >
                {{ s }}
            </span>
        </div>
        <div
            :class="['captcha_container', isLock && 'lock']"
            @click="handlePointerSetClick"
        >
            <canvas
                class="captcha-canvas"
                v-if="props.image"
                ref="canvasRef"
                :width="props.canvasSize[0]"
                :height="props.canvasSize[1]"
            ></canvas>
            <span
                v-for="([x, y], i) in pointers"
                class="captcha-pointer"
                :style="{ top: `${y}%`, left: `${x}%` }"
                @click.stop="() => cancelPointer(i)"
            >
                {{ i + 1 }}
            </span>
            <Transition
                appear
                name="fade"
                v-show="checkTipVisible"
            >
                <div :class="['captcha_image_tip', 'btt', checkStatus]">
                    <span class="captcha_image_tip-text">
                        {{ checkTip }}
                    </span>
                </div>
            </Transition>
            <CdxLoading :visible="isLoading"></CdxLoading>
        </div>
        <div class="captcha_footer">
            <button
                class="refresh"
                @click="handleRefresh"
            >
                <slot name="refresh">刷新</slot>
            </button>
        </div>
    </div>
</template>
