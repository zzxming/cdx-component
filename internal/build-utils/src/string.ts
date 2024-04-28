/**
 * 将驼峰字符转换为短横线连接
 * @param key 需要转换的字符
 * @returns 转换后的短横线连接字符
 */
export const toKebabCase = (key: string) => {
    const result = key.replace(/([A-Z])/g, ' $1').trim();
    return result.split(' ').join('-').toLowerCase();
};
/**
 * 将短横线连接字符转换为小驼峰
 * @param key 需要转换的短横线连接字符
 * @returns 转换后的小驼峰字符
 */
export const toCamelCase = (key: string) => {
    return key.replace(/-(\w)/g, (all, letter) => {
        return letter.toUpperCase();
    });
};

/**
 * 将短横线连接字符转换为大驼峰
 * @param key 需要转换的短横线连接字符
 * @returns 转换后的大驼峰字符
 */
export const toUpperCamelCase = (key: string) => {
    const name = toCamelCase(key);
    return name.slice(0, 1).toUpperCase() + name.slice(1);
};
