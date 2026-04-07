import { SearchEngine, SupportedEngines } from '@interfaces/search-engine';
import { getSearchEngine } from '@utils/getSearchEngine';
import { ChromeMessage } from '@interfaces/tab-messages';
import { EngineCrawler } from '@interfaces/crawler/crawler';
import { createCrawler, serializeCrawler } from '@utils/crawler/crawlerProgress';
import { crawlerStorage } from '@stores/crawler.store';
import { sendMessage } from '@utils/chrome/send-message';
import { processJob } from '@utils/crawler/processJob/processJob';
import { filterStorage } from '@stores/filter.store';
import { FiltersStore } from '@interfaces/filters-store';

const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
const engine = getSearchEngine(pageUrl).engine as SupportedEngines;
const filters: FiltersStore = await filterStorage.get();
const crawler: EngineCrawler = await createCrawler({
    ...(await crawlerStorage.get(engine)),
    engine,
});

// Indeed's pagination is handled via separate page loads. If the crawler is in progress, keep it going
if (engine === SearchEngine.indeed && crawler.isRunning) {
    void sendMessage(ChromeMessage.startCrawler);
}

// Prep the crawler before starting it
const crawlerStartListener = (message: { type?: ChromeMessage }) => {
    if (message.type !== ChromeMessage.startCrawler) return;
    crawler.startTime = performance.now();
    crawler.isRunning = true;
    void processJob(crawler);
};

// Stop the crawler
const crawlerStopListener = (message: { type?: ChromeMessage }) => {
    if (message.type !== ChromeMessage.stopCrawler) return;
    crawler.isRunning = false;
    void crawlerStorage.update(engine, serializeCrawler(crawler));
};

// Signal that the crawler has finished its crawl
const crawlerFinishedListener = (message: { type?: ChromeMessage }) => {
    if (message.type !== ChromeMessage.crawlerFinished) return;
    crawler.isRunning = false;
    crawler.index = 0;
    crawler.jobsPerPage = 0;
    crawler.page = 0;
    crawler.processedCount = 0;
    crawler.skippedCount = 0;
    crawler.startTime = undefined;
    crawler.ttlCount = 0;
    void crawlerStorage.update(engine, serializeCrawler(crawler));
};

chrome.runtime.onMessage.addListener(crawlerStartListener);
chrome.runtime.onMessage.addListener(crawlerStopListener);
chrome.runtime.onMessage.addListener(crawlerFinishedListener);
