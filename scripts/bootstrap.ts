#!/usr/bin/env node
import { readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import consola from 'consola';
import { PKG_NAME, componentRoot, projRoot, toPascalCase } from '@cdx-component/build-utils';
import fs from 'fs-extra';
import { lintFiles } from './lint';

const ignoreComponentsDir = new Set(['node_modules', 'base']);
const main = async () => {
  const componentFiles = readdirSync(componentRoot);
  const componentNames = componentFiles.filter(d => !ignoreComponentsDir.has(d) && statSync(resolve(componentRoot, d)).isDirectory());

  const globalType = `
    declare module '@vue/runtime-core' {
      export interface GlobalComponents {
        ${
          componentNames.map((name) => {
            const upperCamel = `Cdx${toPascalCase(name)}`;
            return `${upperCamel}: (typeof import('${PKG_NAME}'))['${upperCamel}']`;
          }).join('\r\n')
        }
      }
    }

    export {}
  `;
  const DevType = `
    // For this project development
    import '@vue/runtime-core';

    declare module '@vue/runtime-core' {
      // GlobalComponents for Volar
      export interface GlobalComponents {
        ${
          componentNames.map((name) => {
            const upperCamel = `Cdx${toPascalCase(name)}`;
            return `${upperCamel}: (typeof import('../packages/cdx-component'))['${upperCamel}']`;
          }).join('\r\n')
        }
      }
    }

    export {}
  `;

  const DevTypePath = resolve(projRoot, 'types/components.d.ts');
  const globalTypePath = resolve(projRoot, 'global.d.ts');

  await fs.writeFile(DevTypePath, DevType, 'utf8');
  await fs.writeFile(globalTypePath, globalType, 'utf8');
  await lintFiles([globalTypePath, DevTypePath]);
};

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
