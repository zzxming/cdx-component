import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { series, task } from 'gulp';
import { buildOutput, cdxPackage } from '@cdx-component/build-utils';

export const copyFiles = () => copyFile(cdxPackage, path.join(buildOutput, 'package.json'));
task('default', series(copyFiles));
