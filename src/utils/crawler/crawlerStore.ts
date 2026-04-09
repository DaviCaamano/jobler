import { LocalStore, Stores } from '@interfaces/store';
import { FilterSettings, SettingsOptions, Tabs } from '@interfaces/settings';
import { FilterCategories, FiltersStrategy } from '@interfaces/filters-store';
import { getNewCrawlers } from '@utils/crawler/defaultCrawlerState';

export { getNewCrawlers };

export const storageDefaults: LocalStore = {
    [Stores.filters]: {
        [FiltersStrategy.blackList]: {
            text: [],
            title: [],
            company: [],
        },
        [FiltersStrategy.whiteList]: {
            text: [],
            title: [],
            company: [],
        },
    },
    [Stores.jobList]: [],
    [Stores.settings]: {
        [SettingsOptions.filters]: {
            [FilterSettings.filterList]: FiltersStrategy.blackList,
            [FilterSettings.filterCategory]: FilterCategories.text,
        },
        [SettingsOptions.tabs]: Tabs.jobList,
    },
    [Stores.crawler]: getNewCrawlers(),
};
