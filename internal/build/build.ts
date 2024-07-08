#!/usr/bin/env node
import { join, resolve } from 'node:path';
import { buildOutput, buildRoot, cdxPackage, projRoot, run, themeRoot } from '@cdx-component/build-utils';
import { copyFile } from 'fs-extra';

const main = async () => {
  await run('pnpm run bootstrap');

  await run('pnpm build:modules', buildRoot);
  await run('pnpm build:full', buildRoot);

  await run('pnpm build', themeRoot);

  copyFile(cdxPackage, join(buildOutput, 'package.json'));
  copyFile(resolve(projRoot, 'README.md'), resolve(buildOutput, 'README.md'));
  copyFile(resolve(projRoot, 'global.d.ts'), resolve(buildOutput, 'global.d.ts'));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
