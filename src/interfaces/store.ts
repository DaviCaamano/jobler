import { JobSummary } from '@interfaces/job-list';
import { Settings } from '@interfaces/settings';
import { SiteCrawlers } from '@interfaces/crawler/crawler';
import { FiltersStore } from '@interfaces/filters-store';

export enum Stores {
    filters = 'filters',
    crawler = 'crawler',
    jobList = 'jobList',
    settings = 'settings',
}

export interface LocalStore {
    [Stores.filters]: FiltersStore;
    [Stores.crawler]: SiteCrawlers;
    [Stores.jobList]: JobSummary[];
    [Stores.settings]: Settings;
}

export type StoreKey = keyof LocalStore;
