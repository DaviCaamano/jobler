import { SearchEngine } from '@interfaces/search-engine';

export interface JobSummary {
    applied?: boolean;
    companyName: string;
    jobId: string;
    title: string;
    source: SearchEngine;
    url: string;
}
