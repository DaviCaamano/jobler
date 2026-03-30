import { FilterStore } from '@interfaces/filter-store';
import { JobSummary } from '@interfaces/job-list';
import { Settings } from '@interfaces/settings';
import { Crawler } from '@interfaces/crawler/crawler';

export enum Stores {
    blackList = 'blackList',
    whiteList = 'whiteList',
    crawler = 'crawler',
    jobList = 'jobList',
    settings = 'settings',
}

export interface LocalStore {
    [Stores.whiteList]: FilterStore;
    [Stores.blackList]: FilterStore;
    [Stores.crawler]: Crawler;
    [Stores.jobList]: JobSummary[];
    [Stores.settings]: Settings;
}

export type StoreKey = keyof LocalStore;
