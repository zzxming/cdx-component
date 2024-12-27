// For this project development
import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    CdxButton: (typeof import('../packages/cdx-component'))['CdxButton'];
    CdxCaptcha: (typeof import('../packages/cdx-component'))['CdxCaptcha'];
    CdxCaptchaSlider: (typeof import('../packages/cdx-component'))['CdxCaptchaSlider'];
    CdxCollapse: (typeof import('../packages/cdx-component'))['CdxCollapse'];
    CdxCollapseItem: (typeof import('../packages/cdx-component'))['CdxCollapseItem'];
    CdxCollapseTransition: (typeof import('../packages/cdx-component'))['CdxCollapseTransition'];
    CdxColorPicker: (typeof import('../packages/cdx-component'))['CdxColorPicker'];
    CdxCountTo: (typeof import('../packages/cdx-component'))['CdxCountTo'];
    CdxDrawer: (typeof import('../packages/cdx-component'))['CdxDrawer'];
    CdxElementSelect: (typeof import('../packages/cdx-component'))['CdxElementSelect'];
    CdxElementSelectItem: (typeof import('../packages/cdx-component'))['CdxElementSelectItem'];
    CdxIcon: (typeof import('../packages/cdx-component'))['CdxIcon'];
    CdxLoading: (typeof import('../packages/cdx-component'))['CdxLoading'];
    CdxMenu: (typeof import('../packages/cdx-component'))['CdxMenu'];
    CdxMenuItem: (typeof import('../packages/cdx-component'))['CdxMenuItem'];
    CdxModel: (typeof import('../packages/cdx-component'))['CdxModel'];
    CdxOnlyChild: (typeof import('../packages/cdx-component'))['CdxOnlyChild'];
    CdxOverlay: (typeof import('../packages/cdx-component'))['CdxOverlay'];
    CdxPullRefresh: (typeof import('../packages/cdx-component'))['CdxPullRefresh'];
    CdxResize: (typeof import('../packages/cdx-component'))['CdxResize'];
    CdxScrollbar: (typeof import('../packages/cdx-component'))['CdxScrollbar'];
    CdxSidebar: (typeof import('../packages/cdx-component'))['CdxSidebar'];
    CdxTabs: (typeof import('../packages/cdx-component'))['CdxTabs'];
    CdxTextEllipsis: (typeof import('../packages/cdx-component'))['CdxTextEllipsis'];
    CdxTextHighlight: (typeof import('../packages/cdx-component'))['CdxTextHighlight'];
    CdxTooltip: (typeof import('../packages/cdx-component'))['CdxTooltip'];
  }
}

export {};
