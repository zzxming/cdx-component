<script setup lang="ts">
import { useBem } from '@cdx-component/hooks';

const [, bem] = useBem('icon');
</script>

<template>
    <i :class="bem.b()">
        <slot></slot>
    </i>
</template>
