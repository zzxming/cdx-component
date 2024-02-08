<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { nextTick, onMounted, ref, watch } from 'vue';
import { CdxLoading } from 'cdx-component';

const divRef = ref();
const v = ref([]);
watch(v, () => {
    console.log(v.value);
});
const h = ref(true);

watch(h, () => {
    console.log(h.value);
});
const success = () => {
    console.log('success');
};
const fail = () => {
    console.log('fail');
};

onMounted(() => {
    CdxLoading.service({ target: divRef.value, text: '3333' });
});

const imgs = [
    'https://img.btstu.cn/api/images/5e699637490a3.jpg',
    'https://img.btstu.cn/api/images/5ccfc851275d7.jpg',
    'https://img.btstu.cn/api/images/5e54ceb87fea1.png',
];
const img = ref(imgs[0]);
const texts = ref('ming'.split(''));
const refresh = () => {
    console.log('refresh');
    h.value = true;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let c = img.value;
            while (c === img.value) {
                c = imgs[Math.floor(Math.random() * imgs.length)];
            }
            console.log(c);
            img.value = c;
            resolve(true);
            nextTick(() => (h.value = false));
        }, 300);
    });
};
</script>

<template>
    <div
        style="background-color: rgba(0, 0, 0, 0.4)"
        v-mytest="'loading'"
    >
        <CdxModel
            v-model="h"
            fullscreen
        >
            <template #header> header </template>
            contnt
            <template #footer> footer </template>
        </CdxModel>

        <div
            v-loading="h"
            style="width: 200px; height: 200px"
            loading-text="233"
            @click="h = !h"
        ></div>

        <div
            style="width: 200px; height: 200px"
            ref="divRef"
        ></div>
        <CdxElementSelect v-model="v">
            <CdxElementSelectItem
                v-for="info in 20"
                :trueValue="info"
            >
                <div class="item">{{ info }}</div>
            </CdxElementSelectItem>
        </CdxElementSelect>

        <CdxElementSelectItem v-model="h">
            <div class="item">233</div>
        </CdxElementSelectItem>

        <CdxDrawer v-model="h">
            content
            <template #swipe>
                <div
                    @click="h = !h"
                    style="height: 200px; border: 1px solid"
                >
                    class
                </div>
            </template>
        </CdxDrawer>

        <CdxTextEllipsis
            v-model="h"
            style="width: 100px"
            content="克隆一个元素节点会拷贝它所有的属性以及属性值，当然也就包括了属性上绑定的事件 (比如oncli"
            :lines="2"
            expandText="打开"
            collapseText="8888888888888888888"
            ellipsisText="233..."
        >
            <template #default="{ text }">
                <CdxTextHighlight
                    :content="text"
                    :texts="['的', '一']"
                >
                    <template #highlight="{ text }">
                        <a
                            style="color: aqua"
                            href="javascript:;"
                        >
                            {{ text }}
                        </a>
                    </template>
                </CdxTextHighlight>
            </template>
            <template #expendBtn="{ isExpended }"> {{ isExpended }}2333333333333333333 </template>
        </CdxTextEllipsis>

        <CdxTextHighlight
            content="克隆一个元素节点会拷贝它所有的属性以及属性值，当然也就包括了属性上绑定的事件 (比如oncli"
            :texts="['的', '一']"
        >
            <template #highlight="{ text }">
                <a href="javascript:;">{{ text }}</a>
            </template>
            <template #default="{ text }">
                <em>{{ text }}</em>
            </template>
        </CdxTextHighlight>

        <div style="width: 400px">
            <CdxCaptcha
                v-model:loading="h"
                :image="img"
                :texts="texts"
                @success="success"
                @fail="fail"
                :refresh="refresh"
            ></CdxCaptcha>
        </div>
    </div>
</template>

<style>
.item {
    margin: 4px;
    padding: 4px;
}
</style>
