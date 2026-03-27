import { SearchEngine } from '@interfaces/search-engine';

export enum JobTableList {
    filters = 'filters',
    jobList = 'jobList',
}

export interface JobSummary {
    applied?: boolean;
    companyName: string;
    jobId: string;
    title: string;
    source: SearchEngine;
    url: string;
}
