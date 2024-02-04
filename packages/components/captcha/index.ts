import { withInstall } from '@cdx-component/utils';
import Captcha from './src/captcha.vue';

export * from './src/captcha';
export const CdxCaptcha = withInstall(Captcha);
export default CdxCaptcha;
