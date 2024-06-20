<script lang="ts" setup>
import { CdxCollapseTransition } from 'cdx-component';
import { ref, computed, toRef } from 'vue';
import { useDocBem, useGithubSource, usePlayground } from '../composables';

const props = defineProps<{
    source: string;
    rawSource: string;
    path: string;
}>();

const [, bem] = useDocBem('example');

const isExpand = ref(false);

const exampleCodeText = computed(() => (isExpand.value ? '隐藏源代码' : '查看源代码'));
const code = computed(() => decodeURIComponent(props.source));
const rawCode = computed(() => decodeURIComponent(props.rawSource));

const { link } = usePlayground(rawCode.value);
const { url } = useGithubSource(toRef(props, 'path'));

const gotoPlayground = () => window.open(link);
const gotoGithub = () => window.open(url.value);
const copyCode = () => {
    const ta = document.createElement('textarea');
    ta.value = rawCode.value;
    ta.style.position = 'absolute';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
};
const toggleExpand = () => {
    isExpand.value = !isExpand.value;
};
</script>

<template>
    <div :class="bem.be('code')">
        <div :class="bem.be('actions')">
            <CdxIcon
                :class="bem.be('actions-btn')"
                @click="gotoPlayground"
                title="在 Playground 编辑"
            >
                <i-ic:baseline-build />
            </CdxIcon>
            <CdxIcon
                :class="bem.be('actions-btn')"
                @click="gotoGithub"
                title="在 Github 编辑"
            >
                <i-ic:twotone-create />
            </CdxIcon>
            <CdxIcon
                :class="bem.be('actions-btn')"
                @click="copyCode"
                title="复制代码"
            >
                <i-ic:baseline-content-copy />
            </CdxIcon>
            <CdxIcon
                :class="bem.be('actions-btn')"
                @click="toggleExpand"
                title="查看源代码"
            >
                <i-ic:baseline-data-object />
            </CdxIcon>
        </div>
        <CdxCollapseTransition>
            <div
                :class="bem.be('code-wrapper')"
                v-show="isExpand"
            >
                <div
                    :class="[bem.be('code-inner'), 'language-vue']"
                    v-html="code"
                />
            </div>
        </CdxCollapseTransition>
        <div
            v-show="isExpand"
            :class="bem.be('code-expand')"
            @click="toggleExpand"
        >
            {{ exampleCodeText }}
        </div>
    </div>
</template>

<style lang="less">
.doc-example {
    &__actions {
        @apply flex items-center justify-end py-2 px-4 border-t;
        &-btn {
            color: var(--cdx-gray-4);
            @apply mx-1 cursor-pointer;
            &:hover {
                color: var(--cdx-gray-1);
            }
        }
    }
    &__code {
        &-wrapper {
            @apply overflow-hidden;
        }
        &-expand {
            color: var(--cdx-gray-2);
            background-color: var(--vp-c-bg);
            @apply sticky bottom-0 z-10 w-full flex items-center justify-center p-2 
                   border-t cursor-pointer rounded-b-lg;
            &:hover {
                color: var(--cdx-blue-2);
            }
        }
    }
}
</style>
