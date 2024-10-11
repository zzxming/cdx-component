<script setup lang="ts">
import { CHANGE_EVENT } from '@cdx-component/constants';
import { useBem } from '@cdx-component/hooks';
import { caf, getDecimalLength, getIntegerLength, raf, toStringNumber } from '@cdx-component/utils';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { countToEmits, countToProps } from './count-to';

defineOptions({ name: 'CdxCountTo' });
const props = defineProps(countToProps);
const emits = defineEmits(countToEmits);

const [, bem] = useBem('count-to');

let transitionEndCount = 0;
let startTime = 0;
const currentValue = ref(props.startValue);
const animateId = ref<ReturnType<typeof raf>>();
const durationTime = ref(props.duration);
const lastDurationTime = ref(0);
const startValue = ref(props.startValue);
const isFinished = ref(false);
const animateDisplayValue = ref<string[][]>([]);
const resetting = ref(false);

const isCountDown = computed(() => props.startValue > props.endValue);
const intergerCount = computed(() => Math.max(getIntegerLength(props.startValue), getIntegerLength(props.endValue)));
const decimalCount = computed(
  () => props.decimal || Math.max(getDecimalLength(props.startValue), getDecimalLength(props.endValue)),
);
const displayValue = computed(() => {
  const strNum = toStringNumber(Math.abs(currentValue.value));
  let [integer, deciaml = ''] = strNum.split('.');
  integer = integer.padStart(intergerCount.value, '0');
  deciaml = deciaml.padEnd(decimalCount.value, '0').slice(0, decimalCount.value);
  return (currentValue.value < 0 ? '-' : '') + integer + (deciaml ? `.${deciaml}` : '');
});
const inTransition = computed(() => !isFinished.value && !resetting.value);
const transitionDuration = computed(() => ({
  [bem.cv('count-transition-duration')]: `${inTransition.value ? props.animationDuration : 0}ms`,
}));

const finish = () => {
  isFinished.value = true;
  emits('finish');
};
const stepFn = (time: number, beginValue: number, changeValue: number, duration: number) => {
  return (changeValue * (-(2 ** ((-10 * time) / duration)) + 1) * 1024) / 1023 + beginValue;
};
const count = (time: number) => {
  if (!startTime) {
    startTime = time;
  }
  const progress = time - startTime;
  lastDurationTime.value = durationTime.value - progress;
  const currentNum = stepFn(progress, startValue.value, props.endValue - startValue.value, durationTime.value);
  currentValue.value = Math[isCountDown.value ? 'max' : 'min'](props.endValue, currentNum);

  emits(CHANGE_EVENT, currentValue.value);
  if (progress < durationTime.value && currentValue.value !== props.endValue) {
    animateId.value = raf(count);
  }
  else {
    if (!props.animation) {
      finish();
    }
  }
};
const resetAnimateDisplayValue = () => {
  animateDisplayValue.value = new Array(
    (currentValue.value < 0 ? 1 : 0) + intergerCount.value + (decimalCount.value ? 1 + decimalCount.value : 0),
  )
    .fill(0)
    .map((_, i) => ['0', displayValue.value[i]]);
};
const updateAnimateDisplayValue = () => {
  if (animateDisplayValue.value.length === 0) {
    resetAnimateDisplayValue();
  }

  for (const [i, v] of displayValue.value.split('').entries()) {
    let curValues = animateDisplayValue.value[i];
    if (!curValues) {
      curValues = ['0'];
      animateDisplayValue.value[i] = curValues;
    }
    if (curValues[curValues.length - 1] !== v) {
      curValues.push(v);
    }
  }
  animateDisplayValue.value = animateDisplayValue.value.slice(0, displayValue.value.length);
};
const startCount = () => {
  if (animateId.value) return;
  animateId.value = raf(count);
  isFinished.value = false;
  transitionEndCount = 0;
};
const stopCount = () => {
  if (!animateId.value) return;
  animateId.value && caf(animateId.value);
  animateId.value = 0;
  startTime = 0;
  durationTime.value = lastDurationTime.value;
  startValue.value = currentValue.value;

  updateAnimateDisplayValue();
};
const reset = () => {
  resetting.value = true;
  stopCount();
  durationTime.value = props.duration;
  currentValue.value = props.startValue;
  startValue.value = props.startValue;
  lastDurationTime.value = 0;
  isFinished.value = false;
  startTime = 0;
  transitionEndCount = 0;
  resetAnimateDisplayValue();
  setTimeout(() => {
    resetting.value = false;
  }, 0);
};
const clearAnimateValue = () => {
  animateDisplayValue.value = animateDisplayValue.value.map(v => ['0'].concat(v.slice(-1)));
};
const handleTransitionEnd = () => {
  nextTick(() => {
    transitionEndCount += 1;
    if (transitionEndCount >= animateDisplayValue.value.filter(v => v.length > 2).length) {
      clearAnimateValue();
      finish();
    }
  });
};

watch(
  () => [props.startValue, props.endValue, props.duration],
  () => {
    reset();
    if (props.autoStart) {
      startCount();
    }
  },
);
watch(displayValue, updateAnimateDisplayValue, { immediate: true });

onMounted(() => {
  props.autoStart && startCount();
});
onBeforeUnmount(() => {
  stopCount();
});

defineExpose({
  reset,
  startCount,
  stopCount,
});
</script>

<template>
  <span :class="bem.b()">
    <slot name="prefix" />
    <slot :value="currentValue">
      <template v-if="!animation">
        {{ displayValue }}
      </template>
      <div
        v-else
        :class="bem.be('animate')"
        :style="transitionDuration"
        @transitionend="handleTransitionEnd"
      >
        <span
          v-for="(strs, i1) in animateDisplayValue"
          :key="i1"
          :class="bem.be('animate-wrapper')"
          :style="{ transform: `translateY(-${strs.length - 1}em)` }"
        >
          <span
            v-for="(s, i2) in strs"
            :key="i2"
          >
            {{ s }}
          </span>
        </span>
      </div>
    </slot>
    <slot name="suffix" />
  </span>
</template>
