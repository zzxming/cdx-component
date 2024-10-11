import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';
import CdxLoading from '..';

describe('Loading.vue', () => {
  it('render test', async () => {
    const visible = ref(true);
    const wrapper = mount(() => <CdxLoading visible={visible.value} text="loading..." background="rgba(0, 0, 0, 0.7)" />);
    const mask = wrapper.find('.cdx-loading__mask');
    expect(mask.text()).toEqual('loading...');
    expect(mask.attributes('style')).toEqual('background-color: rgba(0, 0, 0, 0.7);');
    visible.value = false;
    await nextTick();
    expect(wrapper.find('.cdx-loading__mask').exists()).toBeFalsy();
  });

  it('render fullscreen', async () => {
    const visible = ref(true);
    const wrapper = mount(() => <div><CdxLoading fullscreen={true} visible={visible.value} /></div>);

    await new Promise(resolve => setTimeout(resolve, 300));
    const parentElement = wrapper.find('div.cdx-loading__mask').element.parentElement!;
    expect(wrapper.find('div.cdx-loading__mask').classes()).toContain('cdx-loading--fullscreen');
    expect(parentElement.classList).toContain('cdx-scroll--lock');

    visible.value = false;
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(document.querySelector('.cdx-loading__mask')).toBeNull();
    expect(parentElement.classList).not.toContain('cdx-scroll--lock');
  });

  it('render directive', async () => {
    const visible = ref(true);
    const wrapper = mount(() => <div v-loading={visible.value} loading-text="loading..." loading-background="rgba(0, 0, 0, 0.7)" />, {
      global: {
        directives: { loading: CdxLoading.directive },
      },
    });
    const mask = wrapper.find('.cdx-loading__mask');
    expect(mask).toBeTruthy();
    expect(mask.text()).toEqual('loading...');
    expect(mask.attributes('style')).toEqual('background-color: rgba(0, 0, 0, 0.7);');

    visible.value = false;
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(() => wrapper.get('.cdx-loading__mask')).toThrowError();
  });

  it('render service', async () => {
    const wrapper = mount(() => {
      const targetRef = ref<HTMLElement>();

      const onFull = () => {
        const { close } = CdxLoading.service({
          fullscreen: true,
        });
        setTimeout(() => {
          close();
        }, 0);
      };
      const onTarget = () => {
        const { close } = CdxLoading.service({
          target: targetRef.value,
        });
        setTimeout(() => {
          close();
        }, 0);
      };
      return (
        <div class="root">
          <button class="full" onClick={onFull}>full</button>
          <button class="target" onClick={onTarget}>target</button>
          <div ref={targetRef} class="container" />
        </div>
      );
    }, {
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    await wrapper.find('.full').trigger('click');
    const fullMask = document.querySelector('.cdx-loading__mask')!;
    expect(fullMask.parentNode === document.body).toBeTruthy();
    expect(fullMask.classList).toContain('cdx-loading--fullscreen');
    expect(document.body.classList).toContain('cdx-scroll--lock');

    await new Promise(resolve => setTimeout(resolve, 300));
    expect(document.querySelector('.cdx-loading__mask')).toBeNull();
    expect(document.body.classList).not.toContain('cdx-scroll--lock');

    await wrapper.find('.target').trigger('click');
    expect(wrapper.find('.cdx-loading__mask')).toBeTruthy();
    expect(wrapper.find('.container').classes()).toContain('cdx-scroll--lock');
  });

  it('render service fullscreen single', async () => {
    const instance1 = CdxLoading.service({
      fullscreen: true,
    });
    const instance2 = CdxLoading.service({
      fullscreen: true,
    });

    expect(instance1 === instance2).toBeTruthy();
  });
});
