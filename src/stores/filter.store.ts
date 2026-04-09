import { dedupeStrings } from '@utils/dedupeStrings';
import { storage } from '@stores/storage';
import {
    FilterCategories,
    FilterEntry,
    FiltersCategoryStore,
    FiltersStore,
    FiltersStrategy,
} from '@interfaces/filters-store';
import { Stores } from '@interfaces/store';

async function storageGet(
    strategy: FiltersStrategy,
    category: FilterCategories
): Promise<FilterEntry[]>;
async function storageGet(
    strategy: FiltersStrategy,
    category: undefined
): Promise<FiltersCategoryStore>;
async function storageGet(strategy: undefined, category?: FilterCategories): Promise<FiltersStore>;
async function storageGet(): Promise<FiltersStore>;
async function storageGet(
    strategy?: FiltersStrategy,
    category?: FilterCategories
): Promise<FiltersStore | FiltersCategoryStore | FilterEntry[]> {
    const allFilters: FiltersStore = (await storage.get(Stores.filters)) as Record<
        FiltersStrategy,
        FiltersCategoryStore
    >;
    if (typeof strategy === 'undefined') {
        return allFilters;
    }

    const filter = allFilters[strategy];

    if (category !== undefined) {
        return filter[category];
    }

    return filter;
}

const storageAdd = (
    strategy: FiltersStrategy,
    category: FilterCategories,
    value: FilterEntry
): Promise<FiltersStore> => {
    return storage.patch(Stores.filters, (currentFilters) => ({
        ...currentFilters,
        [strategy]: {
            ...currentFilters[strategy],
            [category]: dedupeStrings([...currentFilters[strategy][category], value]).map(
                (entry: FilterEntry) => (typeof entry === 'string' ? entry.toLowerCase() : entry)
            ),
        },
    }));
};

const storageRemove = (
    strategy: FiltersStrategy,
    category: FilterCategories,
    value: FilterEntry
): Promise<FiltersStore> => {
    return storage.patch(Stores.filters, (currentFilters) => ({
        ...currentFilters,
        [strategy]: {
            ...currentFilters[strategy],
            [category]: currentFilters[strategy][category].filter((item: FilterEntry) =>
                item instanceof RegExp && value instanceof RegExp
                    ? item.source !== value.source || item.flags !== value.flags
                    : item !== value
            ),
        },
    }));
};

const storageReplace = (
    strategy: FiltersStrategy,
    category: FilterCategories,
    values: string[]
): Promise<FiltersStore> => {
    return storage.patch(Stores.filters, (currentFilters) => ({
        ...currentFilters,
        [strategy]: {
            ...currentFilters[strategy],
            [category]: dedupeStrings(values),
        },
    }));
};

export const filterStorage = {
    get: storageGet,
    add: storageAdd,
    remove: storageRemove,
    replace: storageReplace,
};
