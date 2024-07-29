import { describe, expect, it } from 'vitest';
import { renderToString } from '@vue/test-utils';
import CounTo from '..';

describe('SSR for CounTo', () => {
  it('render', async () => {
    try {
      const html = await renderToString(<CounTo endValue={100} />);
      expect(html).toContain('000');
      expect(html).toContain('<span class="cdx-count-to">');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });

  it('render slot', async () => {
    try {
      const html = await renderToString(
        <CounTo endValue={100}>
          {{
            prefix: () => 'P',
            suffix: () => 'S',
            default: ({ value }: { value: number }) => value,
          }}
        </CounTo>,
      );
      expect(html).toContain('P');
      expect(html).toContain('0');
      expect(html).toContain('S');
      expect(html).toContain('<span class="cdx-count-to">');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
