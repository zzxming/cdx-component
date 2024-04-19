<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { countToProps, countToEmits } from './count-to';
import { useBem } from '@cdx-component/hooks';
import { raf, caf, getDecimalLength, precisionNumber, toStringNumber, toFixed } from '@cdx-component/utils';

defineOptions({ name: 'CdxCountTo' });
const props = defineProps(countToProps);
const emits = defineEmits(countToEmits);

const [, bem] = useBem('count-to');

let startTime = 0;
const currentValue = ref(props.startValue);
const animateId = ref<ReturnType<typeof raf>>();

const isCountDown = computed(() => props.startValue > props.endValue);
const displayValue = computed(() => toStringNumber(currentValue.value));
const decimalPlaceCount = computed(
    () => props.decimal || Math.max(getDecimalLength(props.startValue), getDecimalLength(props.endValue))
);

const formatNumber = (n: number) => toFixed(precisionNumber(n), decimalPlaceCount.value);
const stepFn = (time: number, beginValue: number, changeValue: number, duration: number) => {
    // 线性增加
    // return (changeValue * time) / duration + beginValue;
    // 逐渐变慢
    return (changeValue * (-Math.pow(2, (-10 * time) / duration) + 1) * 1024) / 1023 + beginValue;
};
const count = (time: number) => {
    if (!startTime) {
        startTime = time;
    }
    const progress = time - startTime;
    const currentNum = stepFn(progress, props.startValue, props.endValue - props.startValue, props.duration);
    currentValue.value = formatNumber(Math[isCountDown.value ? 'max' : 'min'](props.endValue, currentNum));
    emits('change', currentValue.value);
    if (progress < props.duration && currentValue.value !== props.endValue) {
        animateId.value = raf(count);
    } else {
        emits('finish');
    }
};
const startCount = () => (animateId.value = raf(count));
const stopCount = () => animateId.value && caf(animateId.value);
const restart = () => {
    stopCount();
    startTime = 0;
    currentValue.value = props.startValue;
    startCount();
};

watch(
    () => [props.startValue, props.endValue, props.duration],
    () => {
        props.autoStart && restart();
    }
);

onMounted(() => {
    props.autoStart && startCount();
});
onBeforeUnmount(() => {
    stopCount();
});

defineExpose({
    restart,
    startCount,
    stopCount,
});
</script>

<template>
    <span :class="bem.b()">
        <slot name="prefix"></slot>
        <slot :value="currentValue">
            {{ displayValue }}
        </slot>
        <slot name="suffix"></slot>
    </span>
</template>
