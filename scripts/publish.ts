#!/usr/bin/env node
import { resolve } from 'node:path';
import consola from 'consola';
import {
  buildOutput,
  cdxPackage,
  cdxRoot,
  getPackageManifest,
  run,
} from '@cdx-component/build-utils';
import fs from 'fs-extra';
import prompts from 'prompts';
import { lintFiles } from './lint';

const main = async () => {
  const { version } = await prompts({
    type: 'text',
    name: 'version',
    message: 'Input a update to version:',
  });
  if (!version) {
    consola.error('Please input a update to version.');
    return false;
  }

  await fs.writeFile(resolve(cdxRoot, 'version.ts'), `export const version = '${version}';\n`);

  consola.info(`Update version to: ${version}`);
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
  // TODO: 增加 --proprovenance 通过 GitHub Actions 声明出处. https://docs.npmjs.com/generating-provenance-statements
  await run('npm publish', buildOutput);
};

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
