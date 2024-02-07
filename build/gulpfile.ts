import { copyFile } from 'fs/promises';
import { buildOutput, cdxPackage } from './constans';
import path from 'path';
import { task, series } from 'gulp';

export const copyFiles = () => copyFile(cdxPackage, path.join(buildOutput, 'package.json'));

task('default', series(copyFiles));
