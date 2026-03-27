import { FilterStore } from '@stores/filter-store';
import { JobSummary } from '@stores/job-summary-store';

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
