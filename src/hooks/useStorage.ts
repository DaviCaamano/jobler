import { useCallback, useEffect } from 'react';
import { Stores } from '@interfaces/store';
import { FilterCategories, FilterStore } from '@interfaces/filter-store';
import { Settings, SettingsOptions } from '@interfaces/settings';
import { storage } from '@utils/chrome/storage';
import { deepEqual } from '@utils/deepEqual';
import { useSticky } from '@hooks/useSticky';

export const useStorage = (key: Stores | Stores[], onChange: () => void | Promise<void>) => {
    useEffect(() => {
        const handleStorageChange = (
            changes: { [key: string]: chrome.storage.StorageChange },
            areaName: string
        ) => {
            if (areaName !== 'local') return;

            const didRelevantKeyChange = Array.isArray(key)
                ? key.some((key) => changes[key])
                : !!changes[key];
            if (!didRelevantKeyChange) return;

            void onChange();
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [key, onChange]);

    useEffect(() => {
        void onChange();
    }, []);
};

// Hook for running a callback when a specific settings changes.
export const useSettingStorage = (
    keys: SettingsOptions | SettingsOptions[],
    onChange: (changes: Partial<Settings>) => void | Promise<void>
) => {
    const handleStorageChange = useCallback(
        (changes: { [x: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName !== 'local') return;

            if (Array.isArray(keys)) {
                for (let key of keys) {
                    if (
                        changes[key] &&
                        !deepEqual(
                            (changes[Stores.settings].newValue as Settings)[key],
                            (changes[Stores.settings].oldValue as Settings)[key]
                        )
                    ) {
                        return onChange(changes[key].newValue as Partial<Settings>);
                    }
                }
            } else {
                const newSettings = changes[Stores.settings].newValue as Settings;
                const oldSettings = changes[Stores.settings].oldValue as Settings;
                if (!deepEqual(newSettings[keys], oldSettings[keys])) {
                    onChange(newSettings);
                }
            }
        },
        []
    );

    useEffect(() => {
        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [keys, onChange]);

    // Initialize State from Storage
    useEffect(() => {
        storage.get(Stores.settings).then((currentSettings) => {
            void onChange(currentSettings);
        });
    }, []);
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

            const change = changes[Stores.settings];
            if (!change) return;

            const oldValue = change.oldValue as FilterStore | undefined;
            const newValue = change.newValue as FilterStore | undefined;

            if (!deepEqual(oldValue, newValue)) {
                void onChange();
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [filter, filterCategory, onChange]);

    useSticky(filter, onChange);
    useSticky(filterCategory, onChange);
};
