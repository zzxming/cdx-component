import { isNumber } from './types';

/**
 * 获取整数位个数
 * @param n 要处理的数字
 * @returns 整数位个数
 */
export const getIntegerLength = (n: number) => {
  if (!isNumber(n) || Number.isNaN(n)) return 0;
  const [num, e] = Number(n).toString().split('e');
  const isNegative = num[0] === ('-');
  const [integer] = num.split('.');
  let eNum = 0;
  if (e) {
    eNum = Number(e);
  }
  const res = integer.length - (isNegative ? 1 : 0) + (eNum);
  return res <= 0 ? 1 : res;
};
/**
 * 返回数字的小数位数
 * @param n 指定的数字
 * @returns 数字的小数位数
 */
export const getDecimalLength = (n: number | string) => {
  if (Number.isNaN(Number(n))) return 0;
  const [num, e] = Number(n).toString().split('e');
  const [, decimal = ''] = num.split('.');
  let eNum = 0;
  if (e) {
    eNum = Number(e);
  }
  return decimal.length + eNum * -1;
};
/**
 * 将传入数字转为字符串, 超出 16 位会丢失
 * @param n 转化的数字
 * @returns 完整数字的字符串
 */
export const toStringNumber = (n: number) => {
  const strNum = n.toString();
  if (!strNum.includes('e')) return strNum;
  const isNegative = strNum[0] === '-';
  let [num, e] = strNum.split('e');
  if (isNegative) {
    num = num.slice(1);
  }
  const [, decimal = ''] = num.split('.');
  const eNum = Number(e);
  const zeroCount = eNum > 0 ? Math.max(0, eNum - decimal.length) : Math.abs(eNum) - 1;
  const strZero = '0'.repeat(zeroCount);
  if (eNum < 0) {
    return `${isNegative ? '-' : ''}0.${strZero}${num.replace('.', '')}`;
  }
  return num.replace('.', '') + strZero;
};
/**
 * 保留数字小数点后一定的位数
 * @param n 指定的数字
 * @param decimalCount 保留小数点后位数
 * @returns
 */
export const toFixed = (n: number, decimalCount: number) => {
  decimalCount = Number(decimalCount);
  if (!isNumber(decimalCount) || Number.isNaN(decimalCount) || decimalCount < 0) throw new Error('argument decimalCount must be a number greater than or equal to 0');
  let [integer, decimal = ''] = toStringNumber(n).split('.');
  const isNegative = integer[0] === '-';
  if (decimal.length < decimalCount) decimal += '0'.repeat(decimalCount - decimal.length);
  let saveDeciaml = decimal.slice(0, decimalCount);
  if (Number(decimal[decimalCount]) > 4 && saveDeciaml.length > 0) {
    saveDeciaml = (Number(saveDeciaml) + 1).toString();
    if (saveDeciaml.length > decimalCount) {
      saveDeciaml = saveDeciaml.slice(1);
      integer = `${Number(integer) + (isNegative ? -1 : 1)}`;
    }
  }
  return `${integer}${saveDeciaml.length > 0 ? `.${saveDeciaml}` : ''}`;
};
