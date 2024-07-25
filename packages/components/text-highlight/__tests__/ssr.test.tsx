import { describe, expect, it } from 'vitest';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import TextHightlight from '../src/text-highlight.vue';

const TEXT = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos repellat adipisci nulla amet dolorem veritatis. Assumenda sapiente vel nihil repellendus beatae delectus molestiae, recusandae quo autem neque, provident magnam! Blanditiis?';
const HIGHLIGHT = ['Lorem'];

describe('SSR for TextHightlight', () => {
  it('render', async () => {
    try {
      const html = await renderToString(createSSRApp(() => <TextHightlight texts={HIGHLIGHT} content={TEXT} />));
      expect(html).toContain('<span class="cdx-text-highlight__highlight">Lorem</span>');
      expect(html).toContain(' ipsum dolor, sit amet consectetur adipisicing elit. Eos repellat adipisci nulla amet dolorem veritatis. Assumenda sapiente vel nihil repellendus beatae delectus molestiae, recusandae quo autem neque, provident magnam! Blanditiis?');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
