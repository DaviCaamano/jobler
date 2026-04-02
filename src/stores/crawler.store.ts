import { storage } from '@stores/storage';
import { Stores } from '@interfaces/store';
import { SupportedEngines } from '@interfaces/search-engine';
import { EngineCrawlerState, SiteCrawlers } from '@interfaces/crawler/crawler';
import { getNewCrawlers } from '@utils/crawler/crawlerStore';
import { createCrawler } from '@utils/crawler/crawlerProgress';

export const crawlerStorage = {
    async get(engine: SupportedEngines): Promise<EngineCrawlerState> {
        return (await storage.get(Stores.crawler))[engine] as EngineCrawlerState;
    },

    async update(engine: SupportedEngines, state: EngineCrawlerState): Promise<SiteCrawlers> {
        return storage.patch(Stores.crawler, (currentCrawler: SiteCrawlers) => ({
            ...currentCrawler,
            [engine]: state,
        }));
    },

    async clear(engine?: SupportedEngines): Promise<void> {
        if (engine) {
            await storage.patch(Stores.crawler, (currentCrawler: SiteCrawlers) => ({
                ...currentCrawler,
                [engine]: createCrawler({ engine }),
            }));
        } else {
            await storage.set(Stores.crawler, await getNewCrawlers());
        }
    },
};
