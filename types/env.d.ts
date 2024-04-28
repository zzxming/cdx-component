import { INSTALLED_KEY } from '@cdx-component/constants';

declare module 'vue' {
    export interface App {
        [INSTALLED_KEY]?: boolean;
    }
}
