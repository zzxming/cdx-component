import { copyFile } from 'fs/promises';
import path from 'path';
import { task, series } from 'gulp';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// import dts from 'vite-plugin-dts';
import * as glob from 'glob';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import type { OutputOptions, ModuleFormat } from 'rollup';
import { rollup } from 'rollup';
import {
    PKG_NAME,
    PKG_PREFIX,
    projRoot,
    cdxPackage,
    buildOutput,
    cdxRoot,
    pkgRoot,
    componentPackage,
    rollupExternalFromPackage,
} from '@cdx-component/build-utils';

export const copyFiles = () => copyFile(cdxPackage, path.join(buildOutput, 'package.json'));
task('default', series(copyFiles));

// const beforeWriteFile = (target: string) => {
//     return (filePath: string, content: string) => {
//         if (['gulpfile', 'build'].some((exclude) => filePath.includes(exclude))) return false;
//         // rollup 打包根为 cdx-component, 打包后文件需同步 d.ts 出现在根, 并处理相对路径
//         if (filePath.includes(`/${target}/cdx-component/`)) {
//             return {
//                 filePath: filePath.replace(`/${target}/cdx-component/`, `/${target}/`),
//                 content: content.replace(/\.\.\//g, './'),
//             };
//         }
//     };
// };
// const dtsConfig = (target: string) => {
//     return {
//         entryRoot: pkgRoot,
//         outDir: path.resolve(buildOutput, target),
//         tsconfigPath: path.resolve(projRoot, 'tsconfig.json'),
//         beforeWriteFile: beforeWriteFile(target),
//     };
// };
// const rollupOutput = (target: ModuleFormat, format: string): OutputOptions => ({
//     format: target,
//     entryFileNames: '[name].js',
//     preserveModules: true,
//     dir: path.resolve(buildOutput, format),
//     preserveModulesRoot: cdxRoot,
//     exports: target === 'cjs' ? 'named' : undefined,
//     paths: (id: string) => {
//         if (id.startsWith(`${PKG_PREFIX}/theme`)) {
//             return id.replace(PKG_PREFIX, PKG_NAME);
//         }
//         return id;
//     },
// });
// // return await bundle.write({
// //     target: 'modules',
// //     outDir: path.resolve(buildOutput, 'es'),
// //     sourcemap: true,
// //     minify: false,

// //     format: config.format,
// //     dir: config.output.path,
// //     exports: module === 'cjs' ? 'named' : undefined,
// //     preserveModules: true,
// //     preserveModulesRoot: epRoot,
// //     sourcemap: true,
// //     entryFileNames: `[name].${config.ext}`,

// //   format: "umd",
// //   name: "bundle",
// //   exports: "named",
// //   dir: path.resolve(outputDir, file),
// // });

// const buildModules = async () => {
//     const input = glob
//         .sync('**/*.{js,ts,vue}', {
//             cwd: pkgRoot,
//             ignore: ['**/*.config.*'],
//             absolute: true,
//         })
//         .filter((path) => !['node_modules', 'gulpfile', 'dist'].some((exclude) => path.includes(exclude)));

//     const bundle = await rollup({
//         input,
//         plugins: [
//             vue(),
//             vueJsx(),
//             // nodeResolve({
//             //     extensions: ['.mjs', '.js', '.json', '.ts'],
//             // }),
//             commonjs(),
//             esbuild({
//                 loaders: {
//                     '.vue': 'ts',
//                 },
//             }),
//             // dts(dtsConfig('es')),
//             // dts(dtsConfig('lib')),
//         ],
//         external: rollupExternalFromPackage(componentPackage, (id: string) => {
//             return /css$/.test(id);
//         }),
//         treeshake: false,
//         preserveEntrySignatures: 'allow-extension',
//     });

//     return Promise.all(
//         [rollupOutput('es', 'es'), rollupOutput('cjs', 'lib')].map((config) => {
//             bundle.write({
//                 ...config,
//             });
//         }),
//     );
// };
// task('buildModules', buildModules);
