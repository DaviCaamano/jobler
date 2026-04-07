export const DEFAULT_JOB_FILTERS = {
    blackList: {
        text: [],
        title: [],
        company: [],
    },
    whiteList: {
        text: [],
        title: [],
        company: [],
    },
};

// LinkedIn CSS Selectors
export const LI_SCROLLABLE_JOB_LIST_SELECTOR = '.scaffold-layout__list > div:first-of-type';
export const LI_JOB_ITEM_SELECTOR = LI_SCROLLABLE_JOB_LIST_SELECTOR + ' > ul > li';
export const LI_JOB_ID_PROPERTY_SELECTOR = 'data-occludable-job-id';
export const LI_TITLE_SELECTOR = '.job-details-jobs-unified-top-card__job-title';
export const LI_JOB_INFO_BUTTONS_SELECTOR = '.job-details-fit-level-preferences';
export const LI_JOB_TTL_AMT_SELECTOR = '.jobs-search-results-list__subtitle > span';
export const LI_NEXT_PAGE_BUTTON_SELECTOR = '.jobs-search-pagination__button--next';

// ZipRecruiter CSS Selectors
export const ZR_JOB_ITEM_SELECTOR = 'section.job_results_two_pane > div.job_result_two_pane_v2';
export const ZR_TITLE_SELECTOR =
    'article:first-of-type > section:first-of-type > div:nth-of-type(2)' +
    ' > div:first-of-type > button:first-of-type > div:first-of-type > div:first-of-type > h2';
export const ZR_NEXT_PAGE_BUTTON_SELECTOR = '[title="Next Page"]';
export const ZR_JOB_SALARY_SELECTOR = 'div.break-all > p';
export const ZR_COMPANY_NAME_SELECTOR = '[data-testid="job-card-company"]';
export const ZR_JOB_ID_SELECTOR = 'article:first-of-type';
export const ZR_JOB_TTL_AMT_SELECTOR = '#serp_content_skip > p';
export const ZR_JOB_DESCRIPTION_SELECTOR = '.text-primary.whitespace-pre-line.wrap-anywhere';

// Indeed CSS Selectors
export const IN_JOB_ITEM_SELECTOR =
    ':is(#mosaic-provider-jobcards-1, #mosaic-provider-jobcards) > div:first-of-type > ul:first-of-type > li > div.result:not([aria-hidden="true"])';
export const IN_JOB_ID_ELEMENT_SELECTOR = '.jcs-JobTitle > span';
export const IN_JOB_SALARY_SELECTOR =
    'ul.metadataContainer > li.salary-snippet-container > div:first-of-type > div > span';
export const IN_COMPANY_NAME_SELECTOR = '[data-testid="company-name"]';
export const IN_JOB_DESCRIPTION_SELECTOR = 'div#jobDescriptionText';
export const IN_CLICKABLE_SELECTOR = '.jcs-JobTitle > span';
export const IN_NEXT_PAGE_BUTTON_SELECTOR = 'a[data-testid="pagination-page-next"]';
export const IN_JOB_TTL_AMT_SELECTOR = '.jobsearch-JobCountAndSortPane-jobCount > span';
