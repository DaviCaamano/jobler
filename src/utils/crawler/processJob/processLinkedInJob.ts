import { SearchEngine } from '@interfaces/search-engine';
import { click } from '@utils/crawler/click';
import {
    LI_JOB_ID_PROPERTY_SELECTOR,
    LI_JOB_INFO_BUTTONS_SELECTOR,
    LI_JOB_TTL_AMT_SELECTOR,
    LI_NEXT_PAGE_BUTTON_SELECTOR,
    LI_TITLE_SELECTOR,
} from '@constants/crawler/crawler';
import { sleep } from '@utils/sleep';
import { addJob, serializeCrawler } from '@utils/crawler/crawlerProgress';
import { JobSummary } from '@interfaces/job-list';
import { ChromeMessage } from '@interfaces/tab-messages';
import { EngineCrawler } from '@interfaces/crawler/crawler';
import { sendMessage } from '@utils/chrome/send-message';
import { toast } from '@utils/crawler/toast';
import {
    getJobListElements,
    getJobText,
    isCrawlerTerminated,
} from '@utils/crawler/processJob/sharedCrawlerGetters';

const MAX_JOB_COPY_ATTEMPTS = 5;
const MAX_JOB_PROCESS_ATTEMPTS = 10;
const COMPANY_NAME_SELECTORS = [
    '.job-details-jobs-unified-top-card__company-name > a',
    '.job-details-jobs-unified-top-card__company-name',
];

const reattemptLinkedInJob = async (iter: number, attempt: number, crawler: EngineCrawler) => {
    if (attempt >= MAX_JOB_PROCESS_ATTEMPTS) {
        void toast(`Unable to load Job #${iter + 1} on list, Skipping...`);
        return processLinkedInJob(iter + 1, attempt + 1, crawler);
    } else {
        await sleep(500);
        return processLinkedInJob(iter, attempt + 1, crawler);
    }
};

const getClickableLinkedInSelector = (jobId: string) => [
    `[data-occludable-job-id="${jobId}"] [data-job-id="${jobId}"]`,
    `[data-occludable-job-id="${jobId}"] .job-card-container--clickable`,
];

const getLinkedInJobDescription = (): HTMLElement | null => {
    return (
        document.querySelector('.jobs-description__content #job-details') || // best target: actual description
        document.querySelector('#job-details') ||
        document.querySelector('.jobs-description__content') ||
        document.querySelector('.jobs-details__main-content')
    );
};

const getLinkedInJobTitle = () => {
    const title = document
        .querySelector(LI_TITLE_SELECTOR)
        ?.querySelector('h1')
        ?.textContent.trim();
    const titleText = title ? `\nTITLE: ${title}\n` : '';
    return { title, titleText };
};

const getLinkedInJobSalary = () => {
    const jobInfoButtons = document
        ?.querySelector(LI_JOB_INFO_BUTTONS_SELECTOR)
        ?.querySelectorAll('button');

    if (!jobInfoButtons) {
        return { salary: '', salaryText: '' };
    }
    for (const button of jobInfoButtons) {
        const strongElement = button?.closest(':has(strong)')?.querySelector('strong');
        const salary = strongElement?.innerText || strongElement?.textContent || '';
        // Check if button has numbers (Only Salary button has numbers)
        if (/\d/g.test(salary)) {
            return { salary, salaryText: salary ? `\nSalary: ${salary}\n` : '' };
        }
    }
    return { salary: '', salaryText: '' };
};

const getLinkedInJobCompanyName = () => {
    const companyNameElement = [
        document.querySelector(COMPANY_NAME_SELECTORS[0]),
        document.querySelector(COMPANY_NAME_SELECTORS[1]),
    ] as [HTMLElement, HTMLElement];
    const companyName =
        companyNameElement[0]?.innerText ||
        companyNameElement[0]?.textContent ||
        companyNameElement[1]?.innerText ||
        companyNameElement[1]?.textContent ||
        '';
    const companyNameText = companyName ? `\nCompany_Name: ${companyName}\n` : '';
    return { companyName, companyNameText };
};

const getLinkedInJobTtlAmt = (): number => {
    const jobTtlAmtSpan = document.querySelector(LI_JOB_TTL_AMT_SELECTOR) as HTMLElement;
    return parseInt(
        (
            jobTtlAmtSpan?.innerText ||
            jobTtlAmtSpan?.textContent ||
            jobTtlAmtSpan?.innerHTML ||
            ''
        ).replace(/\D/g, '')
    );
};

const copyLinkedInJobData = async (
    jobId: string,
    attempt = 0
): Promise<{
    companyName: string;
    text: string;
    title: string;
    ttlCount: number;
    url: string;
}> => {
    const reattemptCopy = async () => {
        if (attempt < MAX_JOB_COPY_ATTEMPTS) {
            await sleep(500);
            return copyLinkedInJobData(jobId, attempt + 1);
        } else {
            void toast('Job data unavailable. skipping.');
            return {
                companyName: '',
                text: '',
                title: '',
                ttlCount: 0,
                url: '',
            };
        }
    };
    const description = getLinkedInJobDescription();
    if (!description) {
        return reattemptCopy();
    }

    const text = getJobText(description);
    if (!text) {
        return reattemptCopy();
    }
    const { title, titleText } = getLinkedInJobTitle();
    if (!title) {
        return reattemptCopy();
    }
    const url = `https://www.linkedin.com/jobs/view/${jobId}`;
    const urlText = `\nURL: ${url}\n`;
    const jobIdText = jobId ? `\nJob_ID: LI-${jobId}\n` : '';
    const { salaryText } = getLinkedInJobSalary();
    const { companyName, companyNameText } = getLinkedInJobCompanyName();
    if (!companyName) {
        return reattemptCopy();
    }
    const ttlCount = getLinkedInJobTtlAmt();
    return {
        companyName,
        text: titleText + urlText + companyNameText + salaryText + jobIdText + '\n' + text,
        title,
        ttlCount,
        url,
    };
};

export const processLinkedInJob = async (
    iter = 0,
    attempt = 0,
    crawler: EngineCrawler
): Promise<void> => {
    const crawlerOutOfJobs = crawler.ttlCount && iter >= crawler.ttlCount;
    if (isCrawlerTerminated(crawler) || crawlerOutOfJobs) {
        void sendMessage(ChromeMessage.crawlerFinished);
        return;
    }
    const jobList = getJobListElements(SearchEngine.linkedin);
    const jobsPerPage = jobList.length;
    // Which index on this page the iter pointing to
    const pageIter = iter % jobsPerPage;
    const job = jobList[pageIter];
    const jobId = job.getAttribute(LI_JOB_ID_PROPERTY_SELECTOR);
    if (!jobId) {
        return reattemptLinkedInJob(iter, attempt, crawler);
    }
    const clickableSelectors = getClickableLinkedInSelector(jobId);
    const clickable: HTMLElement | null =
        document.querySelector(clickableSelectors[0]) ||
        document.querySelector(clickableSelectors[1]);
    if (isCrawlerTerminated(crawler)) {
        void sendMessage(ChromeMessage.crawlerFinished);
        return;
    }

    if (!clickable) {
        return reattemptLinkedInJob(iter, attempt, crawler);
    }

    clickable.scrollIntoView({ behavior: 'smooth', block: 'start' });
    click(clickable);

    // Wait to avoid Code 429 before copying code
    await sleep(2500);
    if (isCrawlerTerminated(crawler)) {
        void sendMessage(ChromeMessage.crawlerFinished);
        return;
    }

    const { companyName, text, title, ttlCount, url } = await copyLinkedInJobData(jobId);
    if (isCrawlerTerminated(crawler)) {
        void sendMessage(ChromeMessage.crawlerFinished);
        return;
    }
    const summary: JobSummary = {
        companyName,
        jobId,
        title,
        source: SearchEngine.linkedin,
        url,
    };
    const lastJobOnPage = jobsPerPage && iter === jobsPerPage;

    const updatedCrawler = {
        ...crawler,
        index: lastJobOnPage ? 0 : crawler.index + 1,
        page: lastJobOnPage ? crawler.page + 1 : crawler.page,
        jobsPerPage,
        ttlCount,
    };
    await sendMessage(ChromeMessage.crawlerProgress, {
        crawler: serializeCrawler(await addJob(summary, text, updatedCrawler)),
    });
    if (lastJobOnPage) {
        // Go to next page
        const button: HTMLButtonElement | null = document.querySelector(
            LI_NEXT_PAGE_BUTTON_SELECTOR
        );
        if (!button || button.disabled) {
            void sendMessage(ChromeMessage.crawlerFinished);
        } else {
            click(button);
            await sleep(2000);
            if (isCrawlerTerminated(crawler) || crawlerOutOfJobs) {
                void sendMessage(ChromeMessage.crawlerFinished);
                return;
            }
            void toast('Moving to next page...');
            return processLinkedInJob(0, 0, crawler);
        }
    } else {
        return processLinkedInJob(iter + 1, 0, crawler);
    }
};
