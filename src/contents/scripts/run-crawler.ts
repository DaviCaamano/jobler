import { Crawler } from '@interfaces/crawler/crawler';
import { SearchEngine, SupportedEngines } from '@interfaces/search-engine';
import { crawlerProgressDefaults } from '@utils/chrome/storage';
import { getSearchEngine } from '@utils/getSearchEngine';
import { toast } from '@utils/crawler/toast';
import { ChromeMessage } from '@interfaces/tab-messages';

const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
const engine = getSearchEngine(pageUrl).engine as SupportedEngines;

let killSwitch = false;
let crawler: Crawler = {
    [SearchEngine.linkedin]: crawlerProgressDefaults,
    [SearchEngine.ziprecruiter]: crawlerProgressDefaults,
    [SearchEngine.indeed]: crawlerProgressDefaults,
};

const runCrawler = async () => {
    // crawler[engine].startTime = performance.now();
    // crawler[engine].inProgress = true;

    let count = 0;
    const interval = setInterval(() => {
        if (killSwitch) {
            clearInterval(interval);
        } else {
            toast(
                `${count++} crawler is running and it\'s like super cool and interesting and awesome`
            );
        }
    }, 1000);
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

chrome.runtime.onMessage.addListener(crawlerStartListener);
chrome.runtime.onMessage.addListener(crawlerStopListener);
