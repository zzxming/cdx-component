import { resolve } from 'node:path';
import { buildOutput } from '@cdx-component/build-utils';
import consola from 'consola';
import { dest, series, src, task } from 'gulp';
import cleanCSS from 'gulp-clean-css';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';

const distBundle = resolve(__dirname, './');

const noPrefixFile = /(base|index)/;
const buildTheme = () => {
  return src('./src/*.less')
    .pipe(less())
    .pipe(postcss())
    .pipe(
      cleanCSS({}, (details) => {
        consola.success(
          `${details.name}: ${details.stats.originalSize / 1000} KB -> ${
            details.stats.minifiedSize / 1000
          } KB`,
        );
      }),
    )
    .pipe(
      rename((p) => {
        if (!noPrefixFile.test(p.basename)) {
          p.basename = `cdx-${p.basename}`;
        }
      }),
    )
    .pipe(dest(distBundle));
};
const copyThemeSource = () => src('./src/**/*.less').pipe(dest(resolve(buildOutput, 'theme', 'src')));
const copyThemeBundle = () => src('./*.css').pipe(dest(resolve(buildOutput, 'theme')));
task('default', series(buildTheme, copyThemeSource, copyThemeBundle));
