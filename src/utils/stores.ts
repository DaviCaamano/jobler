import { SearchEngine } from '@interfaces/search-engine';

export enum Stores {
    blackList = 'blackList',
    jobList = 'jobList',
    whiteList = 'whiteList',
}

export enum FilterCategories {
    text = 'text',
    title = 'title',
    company = 'company',
}

export interface FilterStore {
    text: string[];
    title: string[];
    company: string[];
}

export interface LocalStore {
    [Stores.whiteList]: FilterStore;
    [Stores.blackList]: FilterStore;
    [Stores.jobList]: JobSummary[];
}

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
};

export interface JobSummary {
    applied?: boolean;
    companyName: string;
    jobId: string;
    title: string;
    source: SearchEngine;
    url: string;
}

export const saveToStorage = async <T>(key: Stores, value: T) => {
    await chrome.storage.local.set({ [key]: value });
};

export const loadFromStorage = async <T>(key: Stores): Promise<T> => {
    const result = await chrome.storage.local.get(key);
    if (!result) {
        saveToStorage(key, storageDefaults[key]);
    }
    return result[key] as T;
};

// Set Default Values for all stored state
Object.values(Stores).forEach(async (storageKey: Stores) => {
    if (!(await loadFromStorage(storageKey))) {
        await saveToStorage(storageKey, storageDefaults[storageKey]);
    }
});
