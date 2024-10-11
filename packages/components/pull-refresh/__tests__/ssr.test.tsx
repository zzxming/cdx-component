import { renderToString } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PullRefresh from '../src/pull-refresh.vue';

describe('SSR for TextEllipsis', () => {
  it('render', async () => {
    try {
      const html = await renderToString(
        <PullRefresh>
          {{
            default: () => new Array(10).fill(0).map((_, i) => <li>{i}</li>),
          }}
        </PullRefresh>,
      );
      expect(html).toContain('<div class="cdx-pull-refresh">');
      expect(html).toContain(new Array(10).fill(0).map((_, i) => `<li>${i}</li>`).join(''));
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
