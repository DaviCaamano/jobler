import { SearchEngine, SupportedEngines } from '@interfaces/search-engine';
import { getSearchEngine } from '@utils/getSearchEngine';
import { ChromeMessage } from '@interfaces/tab-messages';
import { EngineCrawler } from '@interfaces/crawler/crawler';
import { createCrawler, updateCrawler } from '@utils/crawler/crawlerProgress';
import { crawlerStorage } from '@stores/crawler.store';
import { sendMessage } from '@utils/chrome/send-message';
import { processJob } from '@utils/crawler/processJob/processJob';

const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
const engine = getSearchEngine(pageUrl).engine as SupportedEngines;
let crawler: EngineCrawler | null = await createCrawler(await crawlerStorage.get(engine));

// Indeed's pagination is handled via separate page loads. If the crawler is in progress, keep it going
if (engine === SearchEngine.indeed && crawler.isRunning) {
    void sendMessage(ChromeMessage.startCrawler);
}

// Prep the crawler before starting it
const crawlerStartListener = async (message: { type?: ChromeMessage }) => {
    if (message.type !== ChromeMessage.startCrawler) return;
    const crawler = await updateCrawler(engine, {
        ...(await createCrawler(await crawlerStorage.get(engine))),
        startTime: performance.now(),
        isRunning: true,
    });
    console.log('outting crawler', crawler);
    void sendMessage(ChromeMessage.runCrawler, { crawler });
};

// Start the actual crawler after it has been prepped
const crawlerRunnerListener = (message: { type?: ChromeMessage; crawler?: EngineCrawler }) => {
    if (message.type === ChromeMessage.runCrawler) {
        console.log('runner', message);
    }
    if (message.type !== ChromeMessage.runCrawler || !message.crawler) return;
    crawler = message.crawler;
    void processJob(crawler);
};

// Stop the crawler
const crawlerStopListener = (message: { type?: ChromeMessage }) => {
    if (message.type !== ChromeMessage.stopCrawler) return;
    if (crawler?.isRunning) {
        crawler.isRunning = false;
    }
};

// Update crawler as it progresses
const crawlerProgressedListener = (message: { type?: ChromeMessage; crawler: EngineCrawler }) => {
    if (message.type === ChromeMessage.crawlerProgress && message?.crawler) {
        createCrawler(message.crawler).then((newCrawler) => {
            crawler = newCrawler;
        });
    }
};

// Signal that the crawler has finished its crawl
const crawlerFinishedListener = (message: { type?: ChromeMessage }) => {
    if (message.type !== ChromeMessage.crawlerFinished) return;
    if (crawler?.isRunning) {
        crawler.isRunning = false;
    }
};

chrome.runtime.onMessage.addListener(crawlerStartListener);
chrome.runtime.onMessage.addListener(crawlerRunnerListener);
chrome.runtime.onMessage.addListener(crawlerStopListener);
chrome.runtime.onMessage.addListener(crawlerProgressedListener);
chrome.runtime.onMessage.addListener(crawlerFinishedListener);
