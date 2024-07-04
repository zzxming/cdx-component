#!/usr/bin/env node
import consola from 'consola';
import {
  buildOutput,
  cdxPackage,
  getPackageManifest,
  run,
  version,
} from '@cdx-component/build-utils';
import fs from 'fs-extra';
import { lintFiles } from './lint';

const main = async () => {
  const projectPkg = getPackageManifest(cdxPackage);
  projectPkg.version = version;

  const pkgData = JSON.stringify(projectPkg);
  await fs.writeFile(
    cdxPackage,
    `{
      ${pkgData.slice(1, -1)}
    }`,
  );
  await lintFiles(cdxPackage);

  await run('pnpm run build');
  // TODO 增加 --proprovenance 通过 GitHub Actions 声明出处. https://docs.npmjs.com/generating-provenance-statements
  await run('npm publish', buildOutput);
};

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
