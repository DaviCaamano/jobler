import { SearchEngine } from '@interfaces/search-engine';
import { jobStorage } from '@stores/job-summary.store';
import { JobSummary } from '@interfaces/job-list';
import { CrawlerProgress } from '@interfaces/crawler/crawler';
import { click } from '@utils/crawler/click';
import { sleep } from '@utils/sleep';

// LinkedIn Selectors
const LI_NEXT_PAGE_BUTTON_SELECTOR = '.jobs-search-pagination__button--next';
// Ziprecruiter Selectors
const ZR_NEXT_PAGE_BUTTON_SELECTOR = '[title="Next Page"]';
// Indeed Selectors
const IN_NEXT_PAGE_BUTTON_SELECTOR = 'a[data-testid="pagination-page-next"]';

// Moves to next page or terminates the crawl if finished.
export const next = async (
    engine: SearchEngine.linkedin | SearchEngine.ziprecruiter | SearchEngine.indeed,
    jobSummaries: JobSummary[],
    crawler: CrawlerProgress,
    processJob: (index: number) => void | Promise<void>
) => {
    await jobStorage.saveAll(jobSummaries);
    crawler.page += 1;
    let buttonSelector;
    switch (engine) {
        case SearchEngine.linkedin:
            buttonSelector = LI_NEXT_PAGE_BUTTON_SELECTOR;
            break;
        case SearchEngine.ziprecruiter:
            buttonSelector = ZR_NEXT_PAGE_BUTTON_SELECTOR;
            break;
        case SearchEngine.indeed:
            buttonSelector = IN_NEXT_PAGE_BUTTON_SELECTOR;
            break;
    }
    const button: HTMLButtonElement | null = document.querySelector(buttonSelector);
    // Move to next page or finish crawl
    if (!button || button.disabled) {
        crawler.page += 1;
        // TODO WRITE LOGIC TO INDICATE THAT THE CRAWLER SHOULD END
    } else {
        click(button);
        // TODO replace this toast call with an update to the crawler UI
        //toast('Moving to next page...');

        await sleep(3000);
        await processJob(0);
    }
};
