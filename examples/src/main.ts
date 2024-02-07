import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);

app.directive('mytest', {
    mounted(el, binding) {},
    updated(el, binding) {},
    unmounted(el) {},
});

app.mount('#app');
