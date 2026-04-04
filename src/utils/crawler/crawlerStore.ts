import { LocalStore, Stores } from '@interfaces/store';
import { SearchEngine } from '@interfaces/search-engine';
import { FilterSettings, SettingsOptions, Tabs } from '@interfaces/settings';
import { FilterCategories } from '@interfaces/filter-store';
import { createCrawler, serializeCrawler } from '@utils/crawler/crawlerProgress';
import { SiteCrawlers } from '@interfaces/crawler/crawler';

export const getNewCrawlers = async (): Promise<SiteCrawlers> => ({
    [SearchEngine.linkedin]: serializeCrawler(
        await createCrawler({
            engine: SearchEngine.linkedin,
        })
    ),
    [SearchEngine.ziprecruiter]: serializeCrawler(
        await createCrawler({
            engine: SearchEngine.ziprecruiter,
        })
    ),
    [SearchEngine.indeed]: serializeCrawler(
        await createCrawler({
            engine: SearchEngine.indeed,
        })
    ),
});

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
    [Stores.settings]: {
        [SettingsOptions.filters]: {
            [FilterSettings.filterList]: Stores.blackList,
            [FilterSettings.filterCategory]: FilterCategories.text,
        },
        [SettingsOptions.tabs]: Tabs.jobList,
    },
    [Stores.crawler]: await getNewCrawlers(),
};
