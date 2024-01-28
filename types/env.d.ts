import { INSTALLED_KEY } from '@cdx-component/constants';

declare module '@vue/runtime-core' {
    export interface App {
        [INSTALLED_KEY]?: boolean;
    }
}
