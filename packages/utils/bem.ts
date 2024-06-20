export const createBEM = (n: string, b: string) => ({
    /** n-b */
    b: () => `${n}-${b}`,
    /** n-b__e */
    be: (e: string) => `${n}-${b}__${e}`,
    /** n-b--m */
    bm: (m: string) => `${n}-${b}--${m}`,
    /** n-b__e--m */
    bem: (e: string, m: string) => `${n}-${b}__${e}--${m}`,
    /** n-s */
    ns: (s: string) => `${n}-${s}`,
    /** n-b-s */
    bs: (s: string) => `${n}-${b}-${s}`,
    /** --n-v */
    cv: (v: string) => `--${n}-${v}`,
});

export const createNamespace = (namespace: string, name: string): [string, ReturnType<typeof createBEM>] => {
    const preName = `${namespace}-${name}`;
    return [preName, createBEM(namespace, name)];
};
