<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { textEllipsisEmits, textEllipsisProps } from './text-ellipsis';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { useBem } from '@cdx-component/hooks';

const props = defineProps(textEllipsisProps);
const emits = defineEmits(textEllipsisEmits);

const [, bem] = useBem('text-ellipsis');

const isEllipsis = ref(false);
const isExpanded = ref(false);
const text = ref('');
const rootRef = ref<HTMLDivElement>();

const model = computed({
    get() {
        return props.modelValue || isExpanded.value;
    },
    set(value) {
        emits(UPDATE_MODEL_EVENT, value);
        isExpanded.value = value;
    },
});
const hasExpandBtn = computed(() => props.canExpand && isEllipsis.value);
const expandBtnText = computed(() => (model.value ? props.collapseText : props.expandText));

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
    const tailText = props.ellipsisText + ' ' + (hasExpandBtn.value ? expandBtnText.value : '');
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
    () => [props.content, props.ellipsisText, props.expandText, props.collapseText],
    () => {
        calcEllipsis();
    }
);

const toggleExpand = () => {
    model.value = !model.value;
};
</script>

<template>
    <div
        ref="rootRef"
        :class="bem.b()"
    >
        {{ model ? props.content : text }}
        <span
            v-if="hasExpandBtn"
            :class="bem.be('expand-btn')"
            @click="toggleExpand"
        >
            <slot
                name="expandBtn"
                :isExpanded="model"
            >
                {{ expandBtnText }}
            </slot>
        </span>
    </div>
</template>
./text-ellipsis
