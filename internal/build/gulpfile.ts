import { copyFile } from 'fs/promises';
import path from 'path';
import { task, series } from 'gulp';
import { cdxPackage, buildOutput } from '@cdx-component/build-utils';

export const copyFiles = () => copyFile(cdxPackage, path.join(buildOutput, 'package.json'));
task('default', series(copyFiles));
