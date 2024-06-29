import { resolve } from 'node:path';
import fs from 'fs-extra';
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
  const data = fs.readFileSync(resolve(projRoot, '.prettierrc'), { encoding: 'utf8' });
  try {
    const config = JSON.parse(data);
    prettierConfig = config;
    return prettierConfig;
  }
  catch {
    throw new Error('Invalid prettier config');
  }
};
