import { FilterEntry } from '@interfaces/filters-store';

export const dedupeStrings = (values: FilterEntry[]): FilterEntry[] => {
    const seen = new Set<string>();
    const result: FilterEntry[] = [];

    values.forEach((value: FilterEntry) => {
        if (value instanceof RegExp) {
            const key = value.toString();
            if (seen.has(key)) return;
            seen.add(key);
            result.push(value);
        } else {
            const normalized = value.trim();

            if (!normalized) return;

            const compareKey = normalized.toLowerCase();

            if (seen.has(compareKey)) return;
            seen.add(compareKey);
            result.push(normalized);
        }
    });

    return result;
};
