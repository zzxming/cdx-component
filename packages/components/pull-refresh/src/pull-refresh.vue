<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { pullRefreshProps, pullRefreshEmits, PullRefreshStatus } from './pull-refresh';
import { useBem, useSlide } from '@cdx-component/hooks';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';

defineOptions({ name: 'CdxPullRefresh' });
const props = defineProps(pullRefreshProps);
const emits = defineEmits(pullRefreshEmits);

const [, bem] = useBem('pull-refresh');

const headTextMap = {
    [PullRefreshStatus.pulling]: '下拉即可刷新...',
    [PullRefreshStatus.loosing]: '松开即可刷新...',
    [PullRefreshStatus.loading]: '加载中...',
    [PullRefreshStatus.none]: '',
};

const trackRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();
const loadingStatus = ref(PullRefreshStatus.none);
const headDistance = ref(0);
const headShouldTransition = ref(false);

let slideRemark: [number, number] | undefined;
const { direction } = useSlide(trackRef, {
    preventDefault: false,
    start: () => {
        if (canPull.value) {
            loadingStatus.value = PullRefreshStatus.pulling;
        }
    },
    move: (e, position) => {
        if (canPull.value) {
            if (contentRef.value!.scrollTop === 0) {
                if (!slideRemark) slideRemark = [position.clientX, position.clientY];
                const diffY = Math.max(0, position.clientY - slideRemark[1] - contentRef.value!.scrollTop);
                if (direction.value[2] && diffY > 0) {
                    e.preventDefault();
                    setHeadDistance(ease(diffY));
                }
            } else {
                slideRemark = undefined;
                setHeadDistance(0);
            }
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
const canPull = computed(() => !props.disabled && PullRefreshStatus.loading !== loadingStatus.value);
const trackStyle = computed(() => ({
    transform: `translate3d(0, ${headDistance.value}px, 0)`,
    transitionDuration: headShouldTransition.value ? `var(${bem.cv('head-duration')})` : '0s',
}));
const headText = computed(() => headTextMap[loadingStatus.value]);
const headStyle = computed(() => ({
    height: `${Number(props.headHeight)}px`,
}));

const setHeadDistance = (distance: number) => {
    headDistance.value = distance;
    if (distance === 0) {
        loadingStatus.value = PullRefreshStatus.none;
    } else if (distance < refreshDistance.value) {
        loadingStatus.value = PullRefreshStatus.pulling;
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

watch(loadingStatus, (value) => {
    headShouldTransition.value = [PullRefreshStatus.none, PullRefreshStatus.loading].includes(value);
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
            ref="trackRef"
            :class="bem.be('track')"
            :style="trackStyle"
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
            <div
                ref="contentRef"
                :class="bem.be('content')"
            >
                <slot></slot>
            </div>
        </div>
    </div>
</template>
