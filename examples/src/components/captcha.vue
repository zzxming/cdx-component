<script setup lang="ts">
const loading = ref(false);

const imgs = [
    'https://img.btstu.cn/api/images/5e699637490a3.jpg',
    'https://img.btstu.cn/api/images/5ccfc851275d7.jpg',
    'https://img.btstu.cn/api/images/5e54ceb87fea1.png',
];
const img = ref(imgs[1]);
const texts = ref('ming'.split(''));
const refresh = () => {
    console.log('refresh');
    loading.value = true;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let resultImg = img.value;
            while (resultImg === img.value) {
                resultImg = imgs[Math.floor(Math.random() * imgs.length)];
            }
            console.log(resultImg);
            img.value = resultImg;
            resolve(true);
            loading.value = false;
        }, 300);
    });
};
const type = ref<'slider' | 'pointer'>('slider');
const changeType = () => {
    if (type.value === 'slider') type.value = 'pointer';
    else type.value = 'slider';
};
const success = () => {
    console.log('success');
};
const fail = () => {
    console.log('fail');
};
const beforSuccess = () => {
    console.log('beforSuccess');
    return {
        success: true,
        message: 'false',
    };
};
</script>

<template>
    <button @click="changeType">change</button>
    <CdxCaptcha
        :type="type"
        :loading="loading"
        :image="img"
        :texts="texts"
        :canvasSize="[500, 300]"
        :fontRate="0.2"
        @success="success"
        @fail="fail"
        :refresh="refresh"
        :onBeforSuccess="beforSuccess"
        :tipDuration="1500"
    ></CdxCaptcha>

    <br />

    <CdxCaptchaSlider></CdxCaptchaSlider>
</template>

<style scoped lang="less"></style>
