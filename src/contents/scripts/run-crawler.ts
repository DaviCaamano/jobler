import { SearchEngine, SupportedEngines } from '@interfaces/search-engine';
import { getSearchEngine } from '@utils/getSearchEngine';
import { ChromeMessage } from '@interfaces/tab-messages';
import { EngineCrawler } from '@interfaces/crawler/crawler';
import { createCrawler, serializeCrawler, updateCrawler } from '@utils/crawler/crawlerProgress';
import { crawlerStorage } from '@stores/crawler.store';
import { sendMessage } from '@utils/chrome/send-message';
import { processJob } from '@utils/crawler/processJob/processJob';
import { filterStorage } from '@stores/filter.store';
import { FiltersStore } from '@interfaces/filters-store';
import { handleFilterChange } from '@hooks/useStorage';

const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
const engine = getSearchEngine(pageUrl).engine as SupportedEngines;
const filters: FiltersStore = await filterStorage.get();

// !!IMPORTANT!!
// Do not at any point re-assign this crawler; the reference is used for the sake of controlling
// and updating the crawler across multiple parts of this app
const crawler: EngineCrawler = await createCrawler({
    ...(await crawlerStorage.get(engine)),
    engine,
    filters,
});

// Indeed's pagination is handled via separate page loads. If the crawler is in progress
// and a new page is loaded, start it back up
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
    crawlerStorage.clear(crawler);
};

// Listeners
chrome.runtime.onMessage.addListener(crawlerStartListener);
chrome.runtime.onMessage.addListener(crawlerStopListener);
chrome.runtime.onMessage.addListener(crawlerFinishedListener);
// Listen for filters changes from the menu UI and update the crawler with the new filters
chrome.storage.onChanged.addListener(
    handleFilterChange(() =>
        updateCrawler({ filters }, crawler).then(
            () => void crawlerStorage.update(engine, serializeCrawler(crawler))
        )
    )
);
