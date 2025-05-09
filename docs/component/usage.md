# 快速上手

## 安装

```sh
npm install cdx-component
```

## 使用

### 自动导入

您需要使用额外的插件来导入要使用的组件。

#### Vite

借助 Vite 插件 unplugin-vue-components 可以更简洁地进行按需引入。

安装插件：

```sh
npm i -D unplugin-vue-components
```

在 `vite.config.ts` 中拓展以下内容：

```ts
import { CdxComponentResolver } from 'cdx-component';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // ...
  plugins: [
    // ...
    Components({
      resolvers: [CdxComponentResolver()],
    }),
  ],
});
```

### 完整引入

```ts
import CdxComponent from 'cdx-component';
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import 'cdx-component/dist/index.css';

const app = createApp(App);

app.use(CdxComponent);
app.mount('#app');
```
