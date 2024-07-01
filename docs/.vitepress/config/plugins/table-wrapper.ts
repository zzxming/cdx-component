import type MarkdownIt from 'markdown-it';

export const tableWrapper = (md: MarkdownIt): void => {
  md.renderer.rules.table_open = () => '<div class="vp-table"><table>';
  md.renderer.rules.table_close = () => '</table></div>';
};
