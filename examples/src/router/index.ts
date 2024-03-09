import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
    {
        path: '/captcha',
        component: () => import('@/components/captcha.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

export default router;
