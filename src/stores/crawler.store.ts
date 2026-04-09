import { storage } from '@stores/storage';
import { Stores } from '@interfaces/store';
import { SupportedEngines } from '@interfaces/search-engine';
import { EngineCrawler, EngineCrawlerState, SiteCrawlers } from '@interfaces/crawler/crawler';
import { serializeCrawler } from '@utils/crawler/crawlerProgress';

export const crawlerStorage = {
    async get(engine: SupportedEngines): Promise<EngineCrawlerState> {
        return (await storage.get(Stores.crawler))[engine] as EngineCrawlerState;
    },

    async update(engine: SupportedEngines, state: EngineCrawlerState): Promise<SiteCrawlers> {
        return storage.patch(Stores.crawler, (currentCrawler: SiteCrawlers) => ({
            ...currentCrawler,
            [engine]: {
                ...currentCrawler[engine],
                ...state,
            },
        }));
    },

    clear(crawler: EngineCrawler): void {
        crawler.isRunning = false;
        crawler.index = 0;
        crawler.jobsPerPage = 0;
        crawler.page = 0;
        crawler.processedCount = 0;
        crawler.skippedCount = 0;
        crawler.startTime = undefined;
        crawler.ttlCount = 0;
        void crawlerStorage.update(crawler.engine as SupportedEngines, serializeCrawler(crawler));
    },
};
