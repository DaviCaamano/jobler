export const dedupeStrings = (values: string[]) => {
    const seen = new Set<string>();
    const result: string[] = [];

    values.forEach((value) => {
        const normalized = value?.trim();
        if (!normalized) return;

        const compareKey = normalized.toLowerCase();
        if (seen.has(compareKey)) return;

        seen.add(compareKey);
        result.push(normalized);
    });

    return result;
};
