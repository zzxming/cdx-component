import CdxComponent from 'cdx-component';
import { createApp } from 'vue';
import App from './src/App.vue';
import 'cdx-component/theme/src/index.less';

const app = createApp(App);
app.use(CdxComponent);
app.mount('#play');
