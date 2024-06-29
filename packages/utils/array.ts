export const ensureArray = (value: any) => (Array.isArray(value) ? (value || []) : [value]);
