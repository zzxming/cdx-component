import { utoa, atou } from '../utils';

const MAIN_FILE_NAME = 'App.vue';

export const usePlayground = (code: string) => {
    const originCode = { [MAIN_FILE_NAME]: code };
    const encoded = utoa(JSON.stringify(originCode));
    const link = `https://zzxming.github.io/cdx-component-playground/#${encoded}`;
    return {
        encoded,
        link,
    };
};
