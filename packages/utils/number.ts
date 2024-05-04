/**
 * 获取整数位个数
 * @param num 要处理的数字
 * @returns 整数位个数
 */
export const getIntegerLength = (num: number) => String(precisionNumber(num)).split('.')[0].length - (num < 0 ? 1 : 0);
/**
 * 确保数字计算精度, 过大仍会处于科学计数发状态
 * @param num 要处理的数字
 * @returns 精度处理后的数字
 */
export const precisionNumber = (num: number) => Number(parseFloat(num.toString()).toPrecision(16));
/**
 * 返回数字的小数位数
 * @param n 指定的数字
 * @returns 数字的小数位数
 */
export const getDecimalLength = (n: number | string) => {
    const [num, eNum] = n.toString().split('e');
    const [, decimal] = num.split('.');
    if (eNum) {
        const e = Number(eNum);
        return e * -1 + (decimal || '').length;
    }
    return (decimal || '').length;
};
/**
 * 将传入数字转为字符串
 * @param n 转化的数字
 * @returns 完整数字的字符串
 */
export const toStringNumber = (n: number) => {
    const strNum = n.toString();
    if (strNum.indexOf('e') === -1) return strNum;
    const [num, eNum] = strNum.split('e');
    const [, decimal] = num.split('.');
    const e = Number(eNum);
    const zeroCount = e > 0 ? Math.max(0, e - (decimal || '').length) : Math.abs(e) - 1;
    const strZero = '0'.repeat(zeroCount);
    if (e < 0) {
        return '0.' + strZero + num.replace('.', '');
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
    if (decimalCount < 0) throw new Error('argument decimalCount must be greater than or equal to 0');
    let [integer, decimal] = toStringNumber(n).toString().split('.');
    if (!decimal) decimal = '';
    if (decimal.length < decimalCount) decimal += '0'.repeat(decimalCount - decimal.length);
    let saveDeciaml = decimal.slice(0, decimalCount);
    if (Number(decimal[decimalCount]) > 4 && saveDeciaml.length) {
        saveDeciaml = (Number(saveDeciaml) + 1).toString();
    }
    return Number(`${integer}${saveDeciaml.length ? `.${saveDeciaml}` : ''}`);
};
