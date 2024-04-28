import fs from 'fs-extra';
import { resolve } from 'path';
import buildUtils from '@cdx-component/build-utils';

const { componentRoot, projRoot } = buildUtils;
export const components = fs.readdirSync(componentRoot).filter((f) => {
    const path = resolve(componentRoot, f);

    if (!fs.statSync(path).isDirectory()) {
        return false;
    }

    return fs.existsSync(`${path}/index.ts`);
});

let prettierConfig: any = null;
export const getPrettierConfig = async () => {
    if (prettierConfig) return prettierConfig;
    const data = fs.readFileSync(resolve(projRoot, '.prettierrc'), { encoding: 'utf-8' });
    try {
        const config = JSON.parse(data);
        prettierConfig = config;
        return prettierConfig;
    } catch (e) {
        throw new Error('Invalid prettier config');
    }
};
