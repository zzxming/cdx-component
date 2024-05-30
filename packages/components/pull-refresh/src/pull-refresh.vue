<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { pullRefreshProps, pullRefreshEmits, PullRefreshStatus } from './pull-refresh';
import { useBem, useSlide } from '@cdx-component/hooks';
import { isNumber } from '@cdx-component/utils';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';

defineOptions({ name: 'CdxPullRefresh' });
const props = defineProps(pullRefreshProps);
const emits = defineEmits(pullRefreshEmits);

const [, bem] = useBem('pull-refresh');

const wrapperRef = ref<HTMLElement>();
const loadingStatus = ref(PullRefreshStatus.none);
const headDistance = ref(0);
const headShouldTransition = ref(false);

const { direction } = useSlide(wrapperRef, {
    move: (_, position) => {
        if (!canPull.value) return;
        if (direction.value[2]) {
            setHeadDistance(ease(position.diffY));
        }
    },
    end: () => {
        if (!canPull.value) return;
        if (loadingStatus.value === PullRefreshStatus.loosing) {
            loadingStatus.value = PullRefreshStatus.loading;
            emits(UPDATE_MODEL_EVENT, true);
        } else {
            setHeadDistance(0);
        }
    },
});

const refreshDistance = computed(() => Number(props.refreshDistance || props.headHeight));
const canPull = computed(
    () => !props.disabled && ![PullRefreshStatus.loading, PullRefreshStatus.success].includes(loadingStatus.value),
);
const wrapperStyle = computed(() => ({
    transform: `translate3d(0, ${headDistance.value}px, 0)`,
    transitionDuration: headShouldTransition.value ? `var(${bem.cv('head-duration')})` : '0s',
}));
const headText = computed(() => {
    const text = {
        [PullRefreshStatus.success]: '刷新成功',
        [PullRefreshStatus.loosing]: '松开即可刷新...',
        [PullRefreshStatus.loading]: '加载中...',
        [PullRefreshStatus.none]: '下拉即可刷新...',
    };
    return text[loadingStatus.value];
});
const headStyle = computed(() => ({
    height: isNumber(props.headHeight) ? `${props.headHeight}px` : props.headHeight,
}));

const setHeadDistance = (distance: number) => {
    headDistance.value = distance;
    if (distance < refreshDistance.value) {
        loadingStatus.value = PullRefreshStatus.none;
    } else if (distance >= refreshDistance.value) {
        loadingStatus.value = PullRefreshStatus.loosing;
    }
};
const ease = (distance: number) => {
    const pullDistance = refreshDistance.value;
    if (distance > pullDistance) {
        if (distance < pullDistance * 2) {
            distance = pullDistance + (distance - pullDistance) / 2;
        } else {
            distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
        }
    }
    return Math.round(distance);
};

watch(loadingStatus, (value, oldValue) => {
    headShouldTransition.value = [PullRefreshStatus.loosing, PullRefreshStatus.loading].includes(oldValue);
    if (value === PullRefreshStatus.loading) {
        emits('refresh');
    }
});
watch(
    () => props.modelValue,
    (value) => {
        if (value) {
            setHeadDistance(refreshDistance.value);
            loadingStatus.value = PullRefreshStatus.loading;
        } else {
            setHeadDistance(0);
        }
    },
);
</script>

<template>
    <div :class="bem.b()">
        <div
            ref="wrapperRef"
            :class="bem.be('wrapper')"
            :style="wrapperStyle"
        >
            <div
                :class="bem.be('head')"
                :style="headStyle"
            >
                <slot
                    name="head"
                    :status="loadingStatus"
                >
                    {{ headText }}
                </slot>
            </div>
            <slot></slot>
        </div>
    </div>
</template>
