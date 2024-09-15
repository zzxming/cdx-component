import { describe, expect, it } from 'vitest';
import { renderToString } from '@vue/test-utils';
import Overlay from '../src/overlay.vue';

describe('SSR for Overlay', () => {
  it('render', async () => {
    try {
      const html = await renderToString(<Overlay modelValue={true}>content</Overlay>);
      expect(html).toContain('content');
      expect(html).toContain('<div class="cdx-overlay" style="position:absolute');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });

  it('render fullscreen', async () => {
    try {
      const html = await renderToString(<Overlay modelValue={true} fullscreen={true}>content</Overlay>);
      expect(html).toContain('content');
      expect(html).toContain('<div class="cdx-overlay" style="position:fixed');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
