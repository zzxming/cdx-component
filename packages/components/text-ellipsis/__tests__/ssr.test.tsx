import { describe, expect, it } from 'vitest';
import { renderToString } from '@vue/test-utils';
import TextEllipsis from '../src/text-ellipsis.vue';

const TEXT = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos repellat adipisci nulla amet dolorem veritatis. Assumenda sapiente vel nihil repellendus beatae delectus molestiae, recusandae quo autem neque, provident magnam! Blanditiis?';

describe('SSR for TextEllipsis', () => {
  it('render', async () => {
    try {
      const html = await renderToString(<TextEllipsis content={TEXT} />);
      expect(html).toContain('<div class="cdx-text-ellipsis"');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
