export type AnyFunction = (...args: any[]) => any;
/** 缓存函数结果 */
export const cacheFunction = <T>(func: (...args: any[]) => T) => {
  let result: T;
  return function () {
    if (result === undefined) {
      result = func();
    }
    return result;
  };
};
