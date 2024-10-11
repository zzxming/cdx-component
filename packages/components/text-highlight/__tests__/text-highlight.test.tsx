import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TextHightlight from '../src/text-highlight.vue';

const TEXT = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos repellat adipisci nulla amet dolorem veritatis. Assumenda sapiente vel nihil repellendus beatae delectus molestiae, recusandae quo autem neque, provident magnam! Blanditiis?';
const HIGHLIGHT = ['ipsum', 'consectetur', 'repellat', 'veritatis', 'Assumenda', 'delectus', 'recusandae', 'provident'];

describe('TextHightlight.vue', () => {
  it('render test', async () => {
    const wrapper = mount(() => <TextHightlight content={TEXT}></TextHightlight>);
    expect(wrapper.text()).toEqual(TEXT);
  });

  it('should render the correct highlighted text', async () => {
    const wrapper = mount(TextHightlight, {
      props: {
        content: TEXT,
        texts: HIGHLIGHT,
        highlightTag: 'strong',
        highlightClass: 'high-light',
      },
    });

    const highlightedTexts = wrapper.findAll('.cdx-text-highlight__highlight.high-light');
    expect(highlightedTexts.length).toBe(HIGHLIGHT.length);

    for (const [i, highlight] of highlightedTexts.entries()) {
      expect(highlight.text()).toBe(HIGHLIGHT[i]);
      expect(highlight.element.tagName.toLowerCase()).toBe('strong');
    }
  });

  it('should match ignore case', async () => {
    const wrapper = mount(TextHightlight, {
      props: {
        content: TEXT,
        texts: HIGHLIGHT.map(s => s.toLowerCase()),
        ignoreCase: true,
      },
    });

    const highlightedTexts = wrapper.findAll('.cdx-text-highlight__highlight');
    expect(highlightedTexts.length).toBe(HIGHLIGHT.length);

    for (const [i, highlight] of highlightedTexts.entries()) {
      expect(highlight.text()).toBe(HIGHLIGHT[i]);
    }
  });
});
