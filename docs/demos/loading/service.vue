<template>
    <button @click="startLoading">open loading</button>
    <button @click="startFullscreenLoading">open fullscreen loading</button>
    <div
        ref="divRef"
        style="position: relative; height: 200px; overflow-y: scroll"
    >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore voluptatum est, dolore temporibus
        voluptatibus totam officiis aliquid labore qui molestiae reprehenderit consectetur omnis, ducimus praesentium
        repellendus placeat? Eos, cum expedita. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem
        exercitationem doloremque maiores consequuntur! In magnam exercitationem accusamus iure explicabo facilis! Ipsam
        sit id officiis ut molestiae numquam ad, quis minus? Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Doloribus ut ratione incidunt maiores quasi eveniet, officia cupiditate reprehenderit porro at voluptas ad
        nesciunt! Facere minima quae praesentium cumque in tempora.
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { CdxLoading } from 'cdx-component';

const divRef = ref();

const startLoading = () => {
    const { close } = CdxLoading.service({ target: divRef.value });
    setTimeout(() => {
        close();
    }, 3000);
};
const startFullscreenLoading = () => {
    const { close } = CdxLoading.service({
        lock: false,
    });
    setTimeout(() => {
        close();
    }, 3000);
};
</script>
