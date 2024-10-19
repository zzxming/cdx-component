import type MarkdownIt from 'markdown-it';
import type { Token } from 'markdown-it';
import fs from 'node:fs';
import path from 'node:path';
import mdContainer from 'markdown-it-container';
import { highlight } from './highlight';
import { tableWrapper } from './table-wrapper';

export const mdPlugin = (md: MarkdownIt) => {
  md.use(useContainer);
  md.use(tableWrapper);
};

function useContainer(md: MarkdownIt) {
  md.use(...createDemoContainer()).use(useCodeWrapper);
}

function readFile(path: string) {
  const fileContent = fs.readFileSync(path, 'utf8');
  if (!fileContent) throw new Error(`Incorrect source file: ${path}`);
  return fileContent;
};
function createDemoContainer() {
  return [
    mdContainer,
    'demo',
    {
      validate(params: string) {
        return !!/^demo\s*(.*)$/.test(params.trim());
      },
      render(tokens: Token[], index: number) {
        const token = tokens[index];
        const demoReg = /^demo\s*(.*)$/;

        if (token.nesting === 1) {
          const matched = token.info.trim().match(demoReg);
          const params = matched?.[1].trim().split(/\s+/) || [];
          let src = params[0];

          let isFile = true;
          const sourceMap: Record<string, string> = {};
          const filePath = `${src}.vue`;
          if (fs.existsSync(path.resolve('./demos', filePath))) {
            src = filePath;
            sourceMap[filePath] = readFile(path.resolve('./demos', filePath));
          }
          else {
            isFile = false;
            const dirPath = path.resolve('./demos', src);
            const files = fs.readdirSync(dirPath);
            for (const item of files) {
              const filePath = path.join(dirPath, item);
              const stats = fs.statSync(filePath);

              if (stats.isFile()) {
                sourceMap[item] = readFile(filePath);
              }
            }
          }

          // if is directory
          // src is the directory
          // if is file
          // src is the file path

          return `<Demos
            :demos="demos"
            raw-source="${Object.values(sourceMap).map(s => encodeURIComponent(s)).join(',')}"
            source="${Object.values(sourceMap).map(s => encodeURIComponent(highlight(s, 'vue'))).join(',')}"
            files="${Object.keys(sourceMap).join(',')}"
            src="${src}"
            :isFile="${isFile}"
          >\n`;
        }
        else {
          return '</Demos>\n';
        }
      },
    },
  ] as const;
}
function useCodeWrapper(md: MarkdownIt) {
  const fence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];
    const rawCode = fence(...args);

    return `<div class="language-${token.info.trim()}">${rawCode}</div>`;
  };
}
