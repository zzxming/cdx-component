import { resolve } from 'node:path';
import { componentRoot } from '@cdx-component/build-utils';
import fs from 'fs-extra';

export const components = fs.readdirSync(componentRoot).filter((f) => {
  const path = resolve(componentRoot, f);

  if (!fs.statSync(path).isDirectory()) {
    return false;
  }

  return fs.existsSync(`${path}/index.ts`);
});
