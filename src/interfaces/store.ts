import { FilterStore } from '@interfaces/filter-store';
import { JobSummary } from '@interfaces/job-list';
import { Settings } from '@interfaces/settings';

export enum Stores {
    blackList = 'blackList',
    whiteList = 'whiteList',
    jobList = 'jobList',
    settings = 'settings',
}

export interface LocalStore {
    [Stores.whiteList]: FilterStore;
    [Stores.blackList]: FilterStore;
    [Stores.jobList]: JobSummary[];
    [Stores.settings]: Settings;
}

export type StoreKey = keyof LocalStore;
