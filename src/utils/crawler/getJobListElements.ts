import { SearchEngine } from '@interfaces/search-engine';

// LinkedIn Selectors
const LI_JOB_ITEM_SELECTOR = '.scaffold-layout__list > div:first-of-type > ul > li';
// Ziprecruiter Selectors
const ZR_JOB_ITEM_SELECTOR = 'section.job_results_two_pane > div.job_result_two_pane_v2';
// Indeed Selectors
const IN_JOB_ITEM_SELECTOR =
    '#mosaic-provider-jobcards > div:first-of-type > ul:first-of-type > li > div.result:not([aria-hidden="true"])';

export interface JobListElements {
    jobList: Element[];
    jobsPerPage?: number;
    maxJobs: number;
}
export const getJobListElements = (engine: SearchEngine): JobListElements => {
    if (engine === SearchEngine.none || engine === SearchEngine.sandbox) {
        return {
            jobList: [],
            jobsPerPage: 0,
            maxJobs: 0,
        };
    }

    const jobList = Array.from(
        document.querySelectorAll(
            engine === SearchEngine.linkedin
                ? LI_JOB_ITEM_SELECTOR
                : engine === SearchEngine.ziprecruiter
                  ? ZR_JOB_ITEM_SELECTOR
                  : engine === SearchEngine.indeed
                    ? IN_JOB_ITEM_SELECTOR
                    : ''
        )
    );

    return {
        jobList,
        jobsPerPage: jobList.length,
        maxJobs: jobList.length - 1,
    };
};
