import { describe, expect, it } from 'vitest';
import { renderToString } from '@vue/test-utils';
import { CdxTooltip } from '..';

describe('SSR for Tooltip', () => {
  it('render', async () => {
    try {
      const html = await renderToString(
        <CdxTooltip text="tip">
          <button>button</button>
        </CdxTooltip>,
      );
      expect(html).toContain('<button>button</button>');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
