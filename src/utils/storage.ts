export enum Storage {
    blackList = 'blackList',
    jobList = 'jobList',
    whiteList = 'whiteList',
}

export const storageDefaults: Record<Storage, any> = {
    [Storage.whiteList]: [],
    [Storage.blackList]: [],
    [Storage.jobList]: [],
};

export const saveToStorage = async <T>(key: string, value: T) => {
    await chrome.storage.local.set({ [key]: value });
};

export const loadFromStorage = async <T>(key: string): Promise<T | undefined> => {
    const result = await chrome.storage.local.get(key);
    return result[key] as T | undefined;
};

// Set Default Values for all stored state
Object.values(Storage).forEach(async (storageKey: Storage) => {
    if (!loadFromStorage(storageKey)) {
        await saveToStorage(storageKey, storageDefaults[storageKey]);
    }
});
