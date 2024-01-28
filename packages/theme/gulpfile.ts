import { src, task, dest, series } from 'gulp';
import postcss from 'gulp-postcss';
import less from 'gulp-less';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import consola from 'consola';
import { resolve } from 'path';
import { buildOutput } from '@cdx-component/build';

const distBundle = resolve(__dirname, './');

const noPrefixFile = /(base)/;
const buildTheme = () => {
    return src('./src/*.less')
        .pipe(less())
        .pipe(postcss())
        .pipe(
            cleanCSS({}, (details) => {
                consola.success(
                    `${details.name}: ${details.stats.originalSize / 1000} KB -> ${
                        details.stats.minifiedSize / 1000
                    } KB`
                );
            })
        )
        .pipe(
            rename((p) => {
                if (!noPrefixFile.test(p.basename)) {
                    p.basename = `cd-${p.basename}`;
                }
            })
        )
        .pipe(dest(distBundle));
};
const copyThemeSource = () => src('./src/*.less').pipe(dest(resolve(buildOutput, 'theme', 'src')));
const copyThemeBundle = () => src('./*.css').pipe(dest(resolve(buildOutput, 'theme')));
task('default', series(buildTheme, copyThemeSource, copyThemeBundle));
