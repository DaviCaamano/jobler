import { JobSummary } from '@interfaces/job-list';
import { SearchEngine } from '@interfaces/search-engine';
import { FiltersStore } from '@interfaces/filters-store';

// State used to populate data on the crawler in-progress UI
export interface CrawlerProgress {
    elapsedTime: string | undefined;
    index: number;
    isRunning: boolean;
    page: number;
    processedCount: number;
    remainingTime: string | undefined;
    skippedCount: number;
    ttlCount: number | undefined;
}

// State used to record data used to run the crawler itself
export interface EngineCrawler {
    engine: SearchEngine;
    filters: FiltersStore;
    index: number;
    isRunning: boolean;
    jobList: JobSummary[];
    jobsPerPage: number;
    page: number;
    processedCount: number;
    skippedCount: number;
    startTime?: number;
    ttlCount: number | undefined;
}

// Serialized version of EngineCrawler saved in Chrome Storage
export interface EngineCrawlerState {
    engine: SearchEngine;
    filters: FiltersStore;
    index: number;
    isRunning: boolean;
    jobList: string;
    jobsPerPage: number;
    page: number;
    processedCount: number;
    skippedCount: number;
    startTime: number | undefined;
    ttlCount: number | undefined;
}

// Storage structure of crawler job list saved to chrome storage
export interface SiteCrawlers {
    [SearchEngine.linkedin]: EngineCrawlerState | undefined;
    [SearchEngine.ziprecruiter]: EngineCrawlerState | undefined;
    [SearchEngine.indeed]: EngineCrawlerState | undefined;
}
