import { useCallback, useEffect, useRef } from 'react';
import { LocalStore, Stores } from '@interfaces/store';
import { FilterGroupSettings, Settings, SettingsOptions } from '@interfaces/settings';
import { deepEqual } from '@utils/deepEqual';
import { useSticky } from '@hooks/useSticky';
import { settingsStore } from '@stores/settingsStore';
import { storage } from '@stores/storage';
import { FilterCategories, FiltersStrategy } from '@interfaces/filters-store';

type UseStorage = <K extends Stores>(
    key: K,
    onChange: (newValue: Partial<LocalStore[K]>) => void | Promise<void>
) => void | Promise<void>;

export const useStorage: UseStorage = <K extends Stores>(
    key: K,
    onChange: (newValue: Partial<LocalStore[K]>) => void | Promise<void>
) => {
    useEffect(() => {
        const handleStorageChange = (
            changes: { [key: string]: chrome.storage.StorageChange },
            areaName: string
        ) => {
            if (areaName !== 'local') return;

            const change = changes[key];
            if (!change) return;

            const oldValue = change.oldValue;
            const newValue = change.newValue as Partial<LocalStore[K]>;
            if (!deepEqual(oldValue, newValue)) {
                void onChange(newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [key, onChange]);

    useEffect(() => {
        storage.get(key).then((storageInit) => {
            void onChange(storageInit as Partial<LocalStore[K]>);
        });
    }, [key, onChange]);
};

// Hook for running a callback when specific settings change.
export const useSettingStorage = (
    keys: SettingsOptions,
    onChange: (changes: Partial<Settings>) => void | Promise<void>
) => {
    const handleStorageChange = useCallback(
        (changes: { [x: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName !== 'local') return;

            const newSettings = changes[Stores.settings].newValue as Settings;
            const oldSettings = changes[Stores.settings].oldValue as Settings;
            if (!deepEqual(newSettings[keys], oldSettings[keys])) {
                onChange(newSettings);
            }
        },
        [keys, onChange]
    );

    useEffect(() => {
        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [handleStorageChange, keys, onChange]);

    // Initialize State from Storage
    const didInit = useRef<boolean>(false);
    useEffect(() => {
        if (!didInit.current) {
            didInit.current = true;
            settingsStore.get().then((currentSettings: Settings) => {
                void onChange(currentSettings);
            });
        }
    }, [onChange]);
};

export const useFilterStorage = (
    filter: FiltersStrategy,
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

            const oldValue = (change.oldValue as Settings)?.[SettingsOptions.filters] as
                | FilterGroupSettings
                | undefined;
            const newValue = (change.newValue as Settings)?.[SettingsOptions.filters] as
                | FilterGroupSettings
                | undefined;
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
