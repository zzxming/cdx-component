export const createBEM = (n: string, b: string) => ({
    b: () => `${n}-${b}`,
    be: (e: string) => `${n}-${b}__${e}`,
    bm: (m: string) => `${n}-${b}--${m}`,
    bem: (e: string, m: string) => `${n}-${b}__${e}--${m}`,
    ns: (s: string) => `${n}-${s}`,
    bs: (s: string) => `${n}-${b}-${s}`,
});

export const createNamespace = (namespace: string, name: string): [string, ReturnType<typeof createBEM>] => {
    const preName = `${namespace}-${name}`;
    return [preName, createBEM(namespace, name)];
};
