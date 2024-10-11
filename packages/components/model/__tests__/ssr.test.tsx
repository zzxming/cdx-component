import { renderToString } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Model from '..';

describe('SSR for Model', () => {
  it('render', async () => {
    try {
      const html = await renderToString(
        <Model modelValue={true}>
          {{
            header: () => 'header',
            default: () => 'default',
            footer: () => 'footer',
          }}
        </Model>,
      );
      expect(html).toContain('<div class="cdx-model__content">');
      expect(html).toContain('<div class="cdx-model__header">');
      expect(html).toContain('<div class="cdx-model__body">');
      expect(html).toContain('<div class="cdx-model__footer">');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });

  it('render hide', async () => {
    try {
      const html = await renderToString(
        <Model>
          {{
            header: () => 'header',
            default: () => 'default',
            footer: () => 'footer',
          }}
        </Model>,
      );
      expect(html).not.toContain('<div class="cdx-model__content">');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
