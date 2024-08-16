import { createApp } from 'vue';
import CdxComponent from 'cdx-component';
import App from './src/App.vue';
import 'cdx-component/theme/src/index.less';

const app = createApp(App);
app.use(CdxComponent);
app.mount('#play');
