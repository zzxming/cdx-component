import { describe, expect, it } from 'vitest';
import { renderToString } from '@vue/test-utils';
import { CdxCollapse, CdxCollapseItem } from '..';

describe('SSR for Collapse', () => {
  it('render expend', async () => {
    try {
      const html = await renderToString(
        () => (
          <CdxCollapse modelValue={['2']}>
            <CdxCollapseItem name="1" title="1">content 1</CdxCollapseItem>
            <CdxCollapseItem name="2" title="2">content 2</CdxCollapseItem>
          </CdxCollapse>
        ),
      );
      expect(html).not.toContain('content 1');
      expect(html).toContain('content 2');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });

  it('render collapse item', async () => {
    try {
      const html = await renderToString(() => (
        <CdxCollapseItem name="1" title="1">1</CdxCollapseItem>
      ));
      expect(html).toContain('<div class="cdx-collapse-item__content">');
    }
    catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
