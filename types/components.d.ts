// For this project development
import '@vue/runtime-core';

declare module '@vue/runtime-core' {
    // GlobalComponents for Volar
    export interface GlobalComponents {
        CdxCaptcha: typeof import('../packages/cdx-component')['CdxCaptcha'];
        CdxCaptchaSlider: typeof import('../packages/cdx-component')['CdxCaptchaSlider'];
        CdxDrawer: typeof import('../packages/cdx-component')['CdxDrawer'];
        CdxElementSelect: typeof import('../packages/cdx-component')['CdxElementSelect'];
        CdxElementSelectItem: typeof import('../packages/cdx-component')['CdxElementSelectItem'];
        CdxIcon: typeof import('../packages/cdx-component')['CdxIcon'];
        CdxLoading: typeof import('../packages/cdx-component')['CdxLoading'];
        CdxModel: typeof import('../packages/cdx-component')['CdxModel'];
        CdxOverlay: typeof import('../packages/cdx-component')['CdxOverlay'];
        CdxTextEllipsis: typeof import('../packages/cdx-component')['CdxTextEllipsis'];
        CdxTextHighlight: typeof import('../packages/cdx-component')['CdxTextHighlight'];
    }
}