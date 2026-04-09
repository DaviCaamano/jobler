import { DEFAULT_JOB_FILTERS } from '@constants/crawler/crawler';
import { EngineCrawlerState, SiteCrawlers } from '@interfaces/crawler/crawler';
import { SearchEngine } from '@interfaces/search-engine';

const createDefaultCrawlerState = (engine: SearchEngine): EngineCrawlerState => ({
    engine,
    filters: structuredClone(DEFAULT_JOB_FILTERS),
    index: 0,
    isRunning: false,
    jobList: '',
    jobsPerPage: 0,
    page: 0,
    processedCount: 0,
    skippedCount: 0,
    startTime: undefined,
    ttlCount: undefined,
});

export const getNewCrawlers = (): SiteCrawlers => ({
    [SearchEngine.linkedin]: createDefaultCrawlerState(SearchEngine.linkedin),
    [SearchEngine.ziprecruiter]: createDefaultCrawlerState(SearchEngine.ziprecruiter),
    [SearchEngine.indeed]: createDefaultCrawlerState(SearchEngine.indeed),
});
