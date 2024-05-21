export const pick = <T extends object, U extends keyof T>(obj: T, names: U[]): Pick<T, U> => {
    const t: any = {};
    for (let i = 0; i < names.length; i++) {
        t[names[i]] = obj[names[i]];
    }
    return t;
};
