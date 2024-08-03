import { describe, expect, it } from 'vitest';
import { renderToString } from '@vue/test-utils';
import OnlyChild from '..';

describe('SSR for OnlyChild', () => {
  it('render', async () => {
    try {
      const html = await renderToString(<OnlyChild>text</OnlyChild>);
      expect(html).toContain('<span>text</span>');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
