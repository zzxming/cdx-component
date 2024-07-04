import { resolve } from 'node:path';
import fs from 'fs-extra';
import { componentRoot } from '@cdx-component/build-utils';

export const components = fs.readdirSync(componentRoot).filter((f) => {
  const path = resolve(componentRoot, f);

  if (!fs.statSync(path).isDirectory()) {
    return false;
  }

  return fs.existsSync(`${path}/index.ts`);
});
