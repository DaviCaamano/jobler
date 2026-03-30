import { Crawler } from '@interfaces/crawler/crawler';
import { SearchEngine, SupportedEngines } from '@interfaces/search-engine';
import { crawlerProgressDefaults } from '@utils/chrome/storage';
import { getSearchEngine } from '@utils/getSearchEngine';

const pageUrl = new URLSearchParams(window.location.search).get('pageUrl') ?? undefined;
const engine = getSearchEngine(pageUrl).engine as SupportedEngines;

let crawler: Crawler = {
    [SearchEngine.linkedin]: crawlerProgressDefaults,
    [SearchEngine.ziprecruiter]: crawlerProgressDefaults,
    [SearchEngine.indeed]: crawlerProgressDefaults,
};

const runCrawler = async () => {
    // crawler[engine].startTime = performance.now();
    // crawler[engine].inProgress = true;
};
