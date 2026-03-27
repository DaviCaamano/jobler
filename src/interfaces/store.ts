import { FilterStore } from '@interfaces/filter-store';
import { JobSummary } from '@interfaces/job-list';

export enum Stores {
    blackList = 'blackList',
    whiteList = 'whiteList',
    jobList = 'jobList',
}

export interface LocalStore {
    [Stores.whiteList]: FilterStore;
    [Stores.blackList]: FilterStore;
    [Stores.jobList]: JobSummary[];
}

export type StoreKey = keyof LocalStore;
