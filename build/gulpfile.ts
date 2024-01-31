import { copyFile } from 'fs/promises';
import { buildOutput, cdPackage } from './constans';
import path from 'path';
import { task, series } from 'gulp';

export const copyFiles = () => copyFile(cdPackage, path.join(buildOutput, 'package.json'));

task('default', series(copyFiles));
