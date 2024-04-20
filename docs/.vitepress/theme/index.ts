import CdxComponent from 'cdx-component';
import DefaultTheme from 'vitepress/theme';
import 'cdx-component/theme/src/index.less';
import './style/base.less';
import { type Theme } from 'vitepress';

export const define = <T>(value: T): T => value;
export default define<Theme>({
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.use(CdxComponent);
    },
});
