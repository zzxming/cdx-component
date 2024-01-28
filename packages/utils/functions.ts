/** 缓存函数结果 */
export const cacheFunction = <T>(func: (...args: any[]) => T) => {
    let result: T;
    return function () {
        if (typeof result === 'undefined') {
            result = func();
        }
        return result;
    };
};
