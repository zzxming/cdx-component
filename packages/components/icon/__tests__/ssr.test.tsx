import { renderToString } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Icon from '..';

describe('SSR for Icon', () => {
  it('render', async () => {
    try {
      const html = await renderToString(<Icon>text</Icon>);
      expect(html).toContain('text');
      expect(html).toContain('<i class="cdx-icon">');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
