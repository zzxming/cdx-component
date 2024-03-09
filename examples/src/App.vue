<script setup lang="ts">
import { routes } from './router';

onMounted(() => {
    document.body.style.backgroundColor = 'rgba(0,0,0,.2)';
});
const divRef = ref();
const div2Ref = ref();
const v = ref([]);
watch(v, () => {
    console.log(v.value);
});
const aa = ref(false);
const cc = ref(false);
const hh = ref(false);
const ww = ref(false);

watch(h, () => {
    console.log(hh.value);
});
const success = () => {
    console.log('success');
};
const fail = () => {
    console.log('fail');
};

const clo = ref(() => {});
onMounted(() => {
    // CdxLoading.service({ target: div2Ref.value, text: '3333' });
    // clo.value = CdxModel.service({
    //     target: divRef.value,
    //     body: '123',
    // });
});
</script>

<template>
    <div style="position: fixed; right: 0px; bottom: 0px; border-top: 1px solid">
        <router-link
            v-for="item in routes"
            :to="item.path"
        >
            {{ item.path }}
        </router-link>
    </div>

    <router-view></router-view>
    <div v-mytest="'loading'">
        <!-- <CdxDrawer v-model="cc">
            <CdxDrawer v-model="ww">
                <div @click="hh = !hh">content233</div>
                <template #swipe>
                    <div
                        @click="ww = !ww"
                        style="height: 200px; border: 1px solid"
                    >
                        class
                    </div>
                </template>
            </CdxDrawer>
            ccccc
            <template #swipe>
                <div style="height: 200px; border: 1px solid">wwwww</div>
            </template>
        </CdxDrawer>

        <div
            style="width: 200px; height: 200px"
            class="cdx-relative"
            ref="divRef"
            @click="clo"
        ></div>
        <div
            style="width: 200px; height: 200px"
            class="cdx-relative"
            ref="div2Ref"
            @click="clo"
        ></div>

        <CdxModel
            v-model="aa"
            fullscreen
        >
            <template #header> header </template>
            contnt
            <template #footer> footer </template>
        </CdxModel>

        <div
            v-loading="hh"
            style="width: 200px; height: 200px"
            loading-text="233"
            @click="hh = !hh"
        ></div>

        <CdxElementSelect v-model="v">
            <CdxElementSelectItem
                v-for="info in 20"
                :trueValue="info"
            >
                <div class="item">{{ info }}</div>
            </CdxElementSelectItem>
        </CdxElementSelect>

        <CdxElementSelectItem v-model="hh">
            <div class="item">233</div>
        </CdxElementSelectItem>

        <CdxTextHighlight
            content="克隆一个元素节点会拷贝它所有的属性以及属性值，当然也就包括了属性上绑定的事件 (比如oncli"
            :texts="['的', '一']"
        >
            <template #highlight="{ text }">
                <a href="javascript:;">{{ text }}</a>
            </template>
            <template #default="{ text }">
                <em style="color: red">{{ text }}</em>
            </template>
        </CdxTextHighlight>

        <CdxTextEllipsis
            v-model="hh"
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
        </CdxTextEllipsis> -->
    </div>
</template>

<style>
.item {
    margin: 4px;
    padding: 4px;
}
</style>
