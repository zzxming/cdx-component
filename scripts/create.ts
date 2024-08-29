#!/usr/bin/env node
import { dirname, resolve } from 'node:path';
import consola from 'consola';
import prompts from 'prompts';
import fs from 'fs-extra';
import {
  componentRoot,
  docsRoot,
  themeRoot,
  toCamelCase,
  toKebabCase,
  toPascalCase,
} from '@cdx-component/build-utils';
import { components } from './constants';
import { lintFiles } from './lint';

// cdx-component/component.ts
// docs/.vitepress/config/index.ts

const create = async (name: string) => {
  if (components.includes(name)) {
    consola.warn(`Component '${name}' already exists`);
    return false;
  }

  let kebabCaseName: string;
  let camelCaseName: string;
  let upperCamelCaseName: string;
  if (/[A-Z]/.test(name)) {
    camelCaseName = toCamelCase(name);
    kebabCaseName = toKebabCase(camelCaseName);
    upperCamelCaseName = toPascalCase(camelCaseName);
  }
  else {
    kebabCaseName = name;
    camelCaseName = toCamelCase(kebabCaseName);
    upperCamelCaseName = toPascalCase(camelCaseName);
  }

  const generateFile = [
    {
      filePath: resolve(componentRoot, `${kebabCaseName}/index.ts`),
      source: `
        import { withInstall } from '@cdx-component/utils';
        import ${upperCamelCaseName} from './src/${kebabCaseName}.vue';

        export const Cdx${upperCamelCaseName} = withInstall(${upperCamelCaseName});
        export * from './src/${kebabCaseName}';
        export default Cdx${upperCamelCaseName};
      `,
    },
    {
      filePath: resolve(componentRoot, `${kebabCaseName}/src/${kebabCaseName}.vue`),
      source: `
        <script setup lang="ts">
        import { ${camelCaseName}Props, ${camelCaseName}Emits } from './${kebabCaseName}';
        import { useBem } from '@cdx-component/hooks';

        defineOptions({ name: 'Cdx${upperCamelCaseName}' });
        const props = defineProps(${camelCaseName}Props);
        const emits = defineEmits(${camelCaseName}Emits);

        const [, bem] = useBem('${kebabCaseName}');
        </script>

        <template>
            <div :class="bem.b()"></div>
        </template>
      `,
    },
    {
      filePath: resolve(componentRoot, `${kebabCaseName}/src/${kebabCaseName}.ts`),
      source: `
        import { buildProps } from '@cdx-component/utils';
        import type { ExtractPropTypes } from 'vue';

        export const ${camelCaseName}Props = buildProps({} as const);
        export type ${upperCamelCaseName}Props = ExtractPropTypes<typeof ${camelCaseName}Props>;

        export const ${camelCaseName}Emits = {};
        export type ${upperCamelCaseName}Emits = typeof ${camelCaseName}Emits;
      `,
    },
    {
      filePath: resolve(componentRoot, `${kebabCaseName}/style/index.ts`),
      source: `
        import '@cdx-component/components/base/style';
        import '@cdx-component/theme/cdx-${kebabCaseName}.css';
      `,
    },
    {
      filePath: resolve(themeRoot, `src/${kebabCaseName}.less`),
      source: `
        @import './shared/variables.less';

        .@{namespace}-${kebabCaseName} {}
      `,
    },
    {
      filePath: resolve(docsRoot, `component/${kebabCaseName}.md`),
      source: `
        # ${upperCamelCaseName}

        ## 基础用法

        :::demo ${kebabCaseName}/base

        :::
      `,
    },
    {
      filePath: resolve(docsRoot, `demos/${kebabCaseName}/base.vue`),
      source: `
        <template>
          <Cdx${upperCamelCaseName}></Cdx${upperCamelCaseName}>
        </template>
      `,
    },
  ];
  const allowCreate = await consola.prompt(
    `The following files will be generated\n${generateFile.map(data => data.filePath).join('\n')}`,
    {
      type: 'confirm',
    },
  );
  if (!allowCreate) return false;

  const generatedFiles: string[] = [];
  const removeGeneratedFiles = () => {
    return Promise.all(
      generatedFiles.map(file =>
        fs.rm(file).catch((rmError: Error) => {
          consola.error(`Failed to delete partially created file ${file}:`, rmError);
        }),
      ),
    );
  };

  try {
    for (let i = 0; i < generateFile.length; i++) {
      const { filePath, source } = generateFile[i];
      if (fs.existsSync(filePath)) {
        throw new Error(`file already exists ${filePath}`);
      }

      const isMarkdown = (filePath.endsWith('.md'));
      await fs.ensureDir(dirname(filePath));
      await fs.writeFile(
        filePath,
        isMarkdown
          ? source
            .split('\n')
            .map(line => line.trim())
            .join('\n')
          : source,
      );
      await lintFiles(filePath);

      generatedFiles.push(filePath);
    }
  }
  catch (error) {
    console.error('An error occurred during file generation');
    console.error(error);
    await removeGeneratedFiles();
    return false;
  }

  const appendFile = [
    {
      filePath: resolve(componentRoot, `index.ts`),
      source: `export * from './${kebabCaseName}';`,
    },
    {
      filePath: resolve(themeRoot, `src/index.less`),
      source: `@import './${kebabCaseName}.less';`,
    },
  ];
  const allowAppend = await consola.prompt(
    `The following files will be appended\n${appendFile.map(data => data.filePath).join('\n')}`,
    {
      type: 'confirm',
    },
  );
  if (!allowAppend) return false;

  try {
    await Promise.all(
      appendFile.map(async ({ filePath, source }) => {
        if (!fs.existsSync(filePath)) {
          throw new Error(`${filePath} does not exist`);
        }
        await fs.appendFile(filePath, source);
        return await lintFiles(filePath);
      }),
    );
  }
  catch (error) {
    console.error('An error occurred during file append. Please handle it manually');
    console.error(error);
    return false;
  }

  return true;
};
const main = async () => {
  const { component: name } = await prompts({
    type: 'text',
    name: 'component',
    message: 'Input a component name:',
  });
  if (!name) {
    consola.error('Please input a component name.');
    return false;
  }

  const code = await create(name);

  if (code) {
    consola.success(`Component '${name}' created successfully`);
  }
  else {
    consola.error('Component name must be specified and not exists');
  }
};

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
