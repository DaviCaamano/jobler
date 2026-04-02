import { SupportedEngines } from '@interfaces/search-engine';
import { getSearchEngine } from '@utils/getSearchEngine';
import { toast } from '@utils/crawler/toast';
import { ChromeMessage } from '@interfaces/tab-messages';
import { EngineCrawler } from '@interfaces/crawler/crawler';

const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
const engine = getSearchEngine(pageUrl).engine as SupportedEngines;

let killSwitch = false;
let crawler: EngineCrawler | null = null;

const runCrawler = async () => {
    // crawler[engine].startTime = performance.now();
    // crawler[engine].inProgress = true;
};
const crawlerStartListener = (message: { type?: ChromeMessage }) => {
    if (message.type !== ChromeMessage.startCrawler) return;
    killSwitch = false;
    void runCrawler();
};

const crawlerStopListener = (message: { type?: ChromeMessage }) => {
    if (message.type !== ChromeMessage.stopCrawler) return;
    killSwitch = true;
};

const crawlerFinishedListener = (message: { type?: ChromeMessage }) => {
    if (message.type !== ChromeMessage.crawlerFinished) return;
    killSwitch = true;
};

chrome.runtime.onMessage.addListener(crawlerStartListener);
chrome.runtime.onMessage.addListener(crawlerStopListener);
chrome.runtime.onMessage.addListener(crawlerFinishedListener);
