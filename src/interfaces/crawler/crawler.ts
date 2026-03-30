import { SearchEngine } from '@interfaces/search-engine';

export interface CrawlerProgress {
    index: number;
    page: number;
    jobId?: string;
    currentTitle?: string;
    currentCompany?: string;
    nextTitle?: string;
    nextCompany?: string;
    processedCount: number;
    skippedCount: number;
    ttlCount: number;
    elapsedTime?: string;
    remainingTime?: string;
    isRunning: boolean;
}

export interface Crawler {
    [SearchEngine.linkedin]: CrawlerProgress;
    [SearchEngine.ziprecruiter]: CrawlerProgress;
    [SearchEngine.indeed]: CrawlerProgress;
}
