import { useEffect } from 'react';
import { Stores } from '@stores/store';
import { FilterCategories, FilterStore } from '@stores/filter-store';

export const useStorage = (keys: Stores[], onChange: () => void | Promise<void>) => {
    useEffect(() => {
        const handleStorageChange = (
            changes: { [key: string]: chrome.storage.StorageChange },
            areaName: string
        ) => {
            if (areaName !== 'local') return;

            const didRelevantKeyChange = keys.some((key) => changes[key]);
            if (!didRelevantKeyChange) return;

            void onChange();
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [keys, onChange]);
};

export const useFilterStorage = (
    filter: Stores.whiteList | Stores.blackList,
    filterCategory: FilterCategories,
    onChange: () => void | Promise<void>
) => {
    useEffect(() => {
        const handleStorageChange = (
            changes: { [key: string]: chrome.storage.StorageChange },
            areaName: string
        ) => {
            if (areaName !== 'local') return;

            const change = changes[filter];
            if (!change) return;

            const oldValue = change.oldValue as FilterStore | undefined;
            const newValue = change.newValue as FilterStore | undefined;

            const oldCategory = oldValue?.[filterCategory] ?? [];
            const newCategory = newValue?.[filterCategory] ?? [];

            if (JSON.stringify(oldCategory) !== JSON.stringify(newCategory)) {
                void onChange();
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [filter, filterCategory, onChange]);
};
