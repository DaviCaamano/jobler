const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const deepEqual = (a: unknown, b: unknown): boolean => {
    if (Object.is(a, b)) return true;

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;

        return a.every((item, index) => deepEqual(item, b[index]));
    }

    if (isObject(a) && isObject(b)) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);

        if (aKeys.length !== bKeys.length) return false;

        return aKeys.every((key) => {
            return Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]);
        });
    }

    return false;
};
