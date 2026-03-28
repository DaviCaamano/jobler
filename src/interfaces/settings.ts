import { Stores } from '@interfaces/store';
import { FilterCategories } from '@interfaces/filter-store';

export enum SettingsOptions {
    filters = 'filters',
    tabs = 'tabs',
}
export enum Tabs {
    jobList = 'jobList',
    filters = 'filters',
}
export enum FilterSettings {
    filterList = 'filterList',
    filterCategory = 'filterCategory',
}
export interface FilterGroupSettings {
    [FilterSettings.filterList]: Stores.blackList | Stores.whiteList;
    [FilterSettings.filterCategory]: FilterCategories;
}

export interface Settings {
    [SettingsOptions.filters]: FilterGroupSettings;
    [SettingsOptions.tabs]: Tabs;
}
