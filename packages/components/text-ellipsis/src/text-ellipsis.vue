<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { textEllipsisEmits, textEllipsisProps } from './text-ellipsis';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';

const props = defineProps(textEllipsisProps);
const emits = defineEmits(textEllipsisEmits);
const model = computed({
    get() {
        return props.modelValue || isExpended.value;
    },
    set(value) {
        emits(UPDATE_MODEL_EVENT, value);
        isExpended.value = value;
    },
});
const isEllipsis = ref(false);
const isExpended = ref(false);
const text = ref('');
const rootRef = ref<HTMLDivElement>();
const hasExpendBtn = computed(() => props.canExpend && isEllipsis.value);
const expendBtnText = computed(() => (model.value ? props.collapseText : props.expendText));

const cloneNode = <T extends HTMLElement>(node: T) => {
    const copy = node.cloneNode(false) as T;
    copy.style.position = 'fixed';
    copy.style.zIndex = '-9999';
    copy.style.top = '-9999px';
    copy.style.left = '-9999px';
    copy.style.minHeight = 'auto';
    copy.innerHTML = props.content;
    document.body.appendChild(copy);
    return copy;
};
const parseNum = (num: any) => {
    const n = parseFloat(num);
    return isNaN(n) ? 0 : n;
};
const calcEllipsisText = (root: HTMLElement, totalHeight: number) => {
    const len = props.content.length;
    // span 和文件间有换行, 不加这个空格可以把文字和 span 间的换行去掉
    const tailText = props.ellipsisText + ' ' + (hasExpendBtn.value ? expendBtnText.value : '');
    const calcDisplay = (left: number, right: number): string => {
        if (right - left <= 1) {
            return props.content.slice(0, left) + props.ellipsisText;
        }
        const mid = Math.round((left + right) / 2);
        root.innerText = props.content.slice(0, mid) + tailText;
        if (root.offsetHeight > totalHeight) {
            return calcDisplay(left, mid);
        } else {
            return calcDisplay(mid, right);
        }
    };
    return calcDisplay(0, len);
};
const calcEllipsis = () => {
    if (!rootRef.value) return;
    const copy = cloneNode(rootRef.value);
    const { paddingTop, paddingBottom, lineHeight } = getComputedStyle(copy);
    const totalHeight =
        parseNum(paddingTop) + parseNum(paddingBottom) + parseNum(lineHeight) * (Number(props.lines) + 0.5);
    if (copy.offsetHeight > totalHeight) {
        isEllipsis.value = true;
        text.value = calcEllipsisText(copy, totalHeight);
    } else {
        isEllipsis.value = false;
        text.value = props.content;
    }
    document.body.removeChild(copy);
};

onMounted(() => {
    calcEllipsis();
    window.addEventListener('resize', calcEllipsis);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', calcEllipsis);
});
watch(
    () => [props.content, props.ellipsisText, props.expendText, props.collapseText],
    () => {
        calcEllipsis();
    }
);

const toggleExpend = () => {
    model.value = !model.value;
};
</script>

<template>
    <div
        ref="rootRef"
        class="text-ellipsis"
    >
        {{ model ? props.content : text }}
        <span
            v-if="hasExpendBtn"
            class="expend-btn"
            @click="toggleExpend"
        >
            <slot
                name="expendBtn"
                :isExpended="model"
            >
                {{ expendBtnText }}
            </slot>
        </span>
    </div>
</template>
./text-ellipsis
