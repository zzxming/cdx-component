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
          const src = params[0];
          // 转换参数为组件, 传入源文件内容
          const sourceFile = src ?? '';
          const source = fs.readFileSync(path.resolve('./demos', `${sourceFile}.vue`), 'utf8');
          if (!source) throw new Error(`Incorrect source file: ${sourceFile}`);

          return `<Demos 
            :demos="demos" 
            raw-source="${encodeURIComponent(source)}" 
            source="${encodeURIComponent(highlight(source, 'vue'))}" 
            src="${src}"
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
