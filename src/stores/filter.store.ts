import { dedupeStrings } from '@utils/dedupeStrings';
import { storage } from '@stores/storage';
import { FilterCategories } from '@interfaces/filter-store';
import { Stores } from '@interfaces/store';

export const filterStorage = {
    async get(store: Stores.blackList | Stores.whiteList, category: FilterCategories) {
        const filters = await storage.get(store);
        return filters[category];
    },

    async add(
        store: Stores.blackList | Stores.whiteList,
        category: FilterCategories,
        value: string
    ) {
        return storage.patch(store, (currentFilters) => ({
            ...currentFilters,
            [category]: dedupeStrings([...currentFilters[category], value]),
        }));
    },

    async remove(
        store: Stores.blackList | Stores.whiteList,
        category: FilterCategories,
        value: string
    ) {
        const normalizedToRemove = value?.trim().toLowerCase();

        return storage.patch(store, (currentFilters) => ({
            ...currentFilters,
            [category]: currentFilters[category].filter(
                (item: string) => item.trim().toLowerCase() !== normalizedToRemove
            ),
        }));
    },

    async replace(
        store: Stores.blackList | Stores.whiteList,
        category: FilterCategories,
        values: string[]
    ) {
        return storage.patch(store, (currentFilters) => ({
            ...currentFilters,
            [category]: dedupeStrings(values),
        }));
    },
};
