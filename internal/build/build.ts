#!/usr/bin/env node
import { join } from 'node:path';
import { buildOutput, buildRoot, cdxPackage, run, themeRoot } from '@cdx-component/build-utils';
import { copyFile } from 'fs-extra';

const main = async () => {
  await run('pnpm build:modules', buildRoot);
  await run('pnpm build:full', buildRoot);

  await run('pnpm build', themeRoot);

  copyFile(cdxPackage, join(buildOutput, 'package.json'));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
