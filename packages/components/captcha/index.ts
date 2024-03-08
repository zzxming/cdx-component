import { withInstall } from '@cdx-component/utils';
import Captcha from './src/captcha.vue';
import CaptchaSlider from './src/captcha-slider.vue';

export const CdxCaptcha = withInstall(Captcha);
export const CdxCaptchaSlider = withInstall(CaptchaSlider);
export * from './src/captcha';
export * from './src/captcha-slider';
export default CdxCaptcha;
