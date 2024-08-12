import { createApp } from 'vue';
import CdxComponent from 'cdx-component';
import App from './src/App.vue';
import 'cdx-component/theme/index.css';

const app = createApp(App);
app.use(CdxComponent);
app.mount('#play');
