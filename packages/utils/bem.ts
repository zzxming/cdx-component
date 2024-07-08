export const createBEM = (n: string, b: string) => {
  const prefix = n ? `${n}-` : '';
  return {
    /** n-b */
    b: () => `${prefix}${b}`,
    /** n-b__e */
    be: (e: string) => `${prefix}${b}__${e}`,
    /** n-b--m */
    bm: (m: string) => `${prefix}${b}--${m}`,
    /** n-b__e--m */
    bem: (e: string, m: string) => `${prefix}${b}__${e}--${m}`,
    /** n-s */
    ns: (s: string) => `${prefix}${s}`,
    /** n-b-s */
    bs: (s: string) => `${prefix}${b}-${s}`,
    /** --n-v */
    cv: (v: string) => `--${prefix}${v}`,
  };
};

export const createNamespace = (name: string, namespace: string = ''): [string, ReturnType<typeof createBEM>] => {
  const preName = `${namespace ? `${namespace}-` : ''}${name}`;
  return [preName, createBEM(namespace, name)];
};
