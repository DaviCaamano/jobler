import { crawlerProgressDefaults, storage } from '@utils/chrome/storage';
import { Stores } from '@interfaces/store';
import { SearchEngine, SupportedEngines } from '@interfaces/search-engine';
import { Crawler, CrawlerProgress } from '@interfaces/crawler/crawler';

export const crawlerStorage = {
    async get(engine: SupportedEngines): Promise<CrawlerProgress> {
        return (await storage.get(Stores.crawler))[engine];
    },

    async update(engine: SupportedEngines, progress: CrawlerProgress): Promise<Crawler> {
        return storage.patch(Stores.crawler, (currentCrawler: Crawler) => ({
            ...currentCrawler,
            [engine]: progress,
        }));
    },

    async clear(engine?: SupportedEngines): Promise<void> {
        if (engine) {
            await storage.patch(Stores.crawler, (currentCrawler: Crawler) => ({
                ...currentCrawler,
                [engine]: crawlerProgressDefaults,
            }));
        } else {
            await storage.set(Stores.crawler, {
                [SearchEngine.linkedin]: crawlerProgressDefaults,
                [SearchEngine.ziprecruiter]: crawlerProgressDefaults,
                [SearchEngine.indeed]: crawlerProgressDefaults,
            });
        }
    },
};
