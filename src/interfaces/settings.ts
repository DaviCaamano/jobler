import { FilterCategories, FiltersStrategy } from '@interfaces/filters-store';

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
    [FilterSettings.filterList]: FiltersStrategy;
    [FilterSettings.filterCategory]: FilterCategories;
}

export interface Settings {
    [SettingsOptions.filters]: FilterGroupSettings;
    [SettingsOptions.tabs]: Tabs;
}
