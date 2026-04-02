import { LocalStore, StoreKey, Stores } from '@interfaces/store';
import { storageDefaults } from '@utils/crawler/crawlerStore';

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
