import type { Plugin } from 'vite';
import path from 'node:path';

export function demoImports(): Plugin {
  return {
    name: 'demos-imports',
    enforce: 'pre',
    async transform(code: string, id: string) {
      if (!/[/\\]component[/\\].+\.md$/.test(id)) return;
      // import all vue file in current demos folder
      const component = path.basename(id, '.md');
      const scriptSetups = [`const demos = import.meta.glob('@docs/demos/${component}/**/*.vue', { eager: true })`];

      return combineMarkdown(code, [`\n<script setup>\n${scriptSetups.join('\n')}\n</script>\n`]);
    },
  };
}

function combineMarkdown(code: string, headers: string[] = [], footers: string[] = []) {
  if (headers.length > 0) {
    const frontmatterEnd = code.indexOf('---\n\n') + 4;
    const firstHeader = code.search(/^#\s.+/) & code.search(/\n#+\s.+/);
    const sliceIndex = firstHeader < 0 ? frontmatterEnd : firstHeader;

    code = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex);
  }
  return `${code + footers.join('\n')}\n`;
}
