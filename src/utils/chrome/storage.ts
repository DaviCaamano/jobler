import { LocalStore, StoreKey, Stores } from '@interfaces/store';
import { FilterSettings, SettingsOptions, Tabs } from '@interfaces/settings';
import { FilterCategories } from '@interfaces/filter-store';
import { SearchEngine } from '@interfaces/search-engine';

export const crawlerProgressDefaults = {
    index: 0,
    page: 0,
    jobId: undefined,
    currentTitle: undefined,
    currentCompany: undefined,
    nextTitle: undefined,
    nextCompany: undefined,
    processedCount: 0,
    skippedCount: 0,
    ttlCount: 0,
    elapsedTime: undefined,
    remainingTime: undefined,
    isRunning: false,
};
export const storageDefaults: LocalStore = {
    [Stores.whiteList]: {
        text: [],
        title: [],
        company: [],
    },
    [Stores.blackList]: {
        text: [],
        title: [],
        company: [],
    },
    [Stores.jobList]: [],
    [Stores.settings]: {
        [SettingsOptions.filters]: {
            [FilterSettings.filterList]: Stores.blackList,
            [FilterSettings.filterCategory]: FilterCategories.text,
        },
        [SettingsOptions.tabs]: Tabs.jobList,
    },
    [Stores.crawler]: {
        [SearchEngine.linkedin]: crawlerProgressDefaults,
        [SearchEngine.ziprecruiter]: crawlerProgressDefaults,
        [SearchEngine.indeed]: crawlerProgressDefaults,
    },
};

const getDefaultValue = <K extends StoreKey>(key: K): LocalStore[K] => {
    return structuredClone(storageDefaults[key]);
};

export const storage = {
    async get<K extends StoreKey>(key: K): Promise<LocalStore[K]> {
        const result = await chrome.storage.local.get(key);
        const value = result[key];

        if (value === undefined) {
            const defaultValue = getDefaultValue(key);
            await chrome.storage.local.set({ [key]: defaultValue });
            return defaultValue;
        }

        return value as LocalStore[K];
    },

    async set<K extends StoreKey>(key: K, value: LocalStore[K]): Promise<void> {
        await chrome.storage.local.set({ [key]: value });
    },

    async patch<K extends StoreKey>(
        key: K,
        updater: (currentValue: LocalStore[K]) => LocalStore[K]
    ): Promise<LocalStore[K]> {
        const currentValue = await this.get(key);
        const nextValue = updater(currentValue);
        await this.set(key, nextValue);
        return nextValue;
    },

    // Resolve Type mismatch
    assignMissingEntry<K extends StoreKey>(
        target: Partial<LocalStore>,
        key: K,
        value: LocalStore[K]
    ) {
        target[key] = value;
    },

    async init() {
        const keys = Object.values(Stores) as StoreKey[];
        const existing = await chrome.storage.local.get(keys);
        const missingEntries: Partial<LocalStore> = {};

        keys.forEach((key) => {
            if (existing[key] === undefined) {
                this.assignMissingEntry(missingEntries, key, getDefaultValue(key));
            }
        });

        if (Object.keys(missingEntries).length) {
            await chrome.storage.local.set(missingEntries);
        }
    },
};

await storage.init();
