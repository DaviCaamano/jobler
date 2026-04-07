import { EngineCrawler } from '@interfaces/crawler/crawler';
import {
    IN_CLICKABLE_SELECTOR,
    IN_COMPANY_NAME_SELECTOR,
    IN_JOB_DESCRIPTION_SELECTOR,
    IN_JOB_ID_ELEMENT_SELECTOR,
    IN_JOB_SALARY_SELECTOR,
    IN_JOB_TTL_AMT_SELECTOR,
    IN_NEXT_PAGE_BUTTON_SELECTOR,
} from '@constants/crawler/crawler';
import {
    getJobListElements,
    getJobText,
    isCrawlerTerminated,
} from '@utils/crawler/processJob/sharedCrawlerGetters';
import { sleep } from '@utils/sleep';
import { toast } from '@utils/crawler/toast';
import { sendMessage } from '@utils/chrome/send-message';
import { ChromeMessage } from '@interfaces/tab-messages';
import { SearchEngine } from '@interfaces/search-engine';
import { click } from '@utils/crawler/click';
import { JobSummary } from '@interfaces/job-list';
import { addJob, getCrawlerProgress, serializeCrawler } from '@utils/crawler/crawlerProgress';
import { crawlerStorage } from '@stores/crawler.store';

const MAX_JOB_COPY_ATTEMPTS = 5;
const MAX_JOB_PROCESS_ATTEMPTS = 10;

const reattemptIndeedJob = async (iter: number, attempt: number, crawler: EngineCrawler) => {
    if (attempt >= MAX_JOB_PROCESS_ATTEMPTS) {
        void toast(`Unable to load Job #${iter + 1} on list, Skipping...`);
        return processIndeedJob(iter + 1, attempt + 1, crawler);
    } else {
        await sleep(500);
        return processIndeedJob(iter, attempt + 1, crawler);
    }
};

const getIndeedJobIdentifiers = (job: HTMLElement) => {
    const titleElement = job.querySelector(IN_JOB_ID_ELEMENT_SELECTOR) as HTMLElement;
    const jobId = titleElement?.id.replace('jobTitle-', '');
    const jobIdText = jobId ? `\nJob_ID: ID-${jobId}\n` : '';
    const title = (titleElement.innerText || titleElement.textContent || '').trim();
    const titleText = title ? `\nTITLE: ${title}\n` : '';
    return { jobId, jobIdText, title, titleText };
};

const getIndeedJobSalary = (job: HTMLElement) => {
    const jobInfoButtons = job.querySelector(IN_JOB_SALARY_SELECTOR) as HTMLElement;
    const salary = (jobInfoButtons?.innerText || jobInfoButtons?.textContent || '').trim();
    const salaryText = salary ? `\nSALARY: ${salary}\n` : '';
    return { salary, salaryText };
};

const getIndeedCompanyName = (job: HTMLElement) => {
    const companyNameElement = job.querySelector(IN_COMPANY_NAME_SELECTOR) as HTMLElement;
    const companyName = (
        companyNameElement?.innerText ||
        companyNameElement?.textContent ||
        ''
    ).trim();
    const companyNameText = companyName ? `\nCompany_Name: ${companyName}\n` : '';
    return { companyName, companyNameText };
};

const getIndeedJobTtlAmt = (): number => {
    const jobTtlAmtSpan = document.querySelector(IN_JOB_TTL_AMT_SELECTOR) as HTMLElement;
    return parseInt(
        (
            jobTtlAmtSpan?.innerText ||
            jobTtlAmtSpan?.textContent ||
            jobTtlAmtSpan?.innerHTML ||
            ''
        ).replace(/\D/g, '')
    );
};

const getJobDescription = async (): Promise<HTMLElement | null> => {
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const jobDescription = document.querySelector<HTMLElement>(IN_JOB_DESCRIPTION_SELECTOR);

        if (jobDescription) {
            return jobDescription;
        }

        await new Promise<void>((resolve) => setTimeout(resolve, 500));
    }

    alert('Could not find the job description.');
    return null;
};

const copyIndeedJobData = async (
    job: HTMLElement,
    attempt = 0
): Promise<{
    companyName: string;
    jobId: string;
    text: string;
    title: string;
    ttlCount: number;
    url: string;
}> => {
    const reattemptCopy = async () => {
        if (attempt < MAX_JOB_COPY_ATTEMPTS) {
            await sleep(500);
            return copyIndeedJobData(job, attempt + 1);
        } else {
            void toast('Job data unavailable. skipping.');
            return {
                companyName: '',
                jobId: '',
                text: '',
                title: '',
                ttlCount: 0,
                url: '',
            };
        }
    };
    const jobDescription = await getJobDescription();
    if (!jobDescription) {
        return reattemptCopy();
    }
    const text = getJobText(jobDescription);
    if (!text) {
        return reattemptCopy();
    }
    const { jobId, jobIdText, title, titleText } = getIndeedJobIdentifiers(job);
    if (!jobId || !title) {
        return reattemptCopy();
    }
    const url = `https://www.indeed.com/viewjob?jk=${jobId}`;
    const urlText = `\n${url}\n`;
    const { salaryText } = getIndeedJobSalary(job);
    const { companyName, companyNameText } = getIndeedCompanyName(job);
    if (!companyName) {
        return reattemptCopy();
    }
    const ttlCount = getIndeedJobTtlAmt();

    return {
        companyName,
        jobId,
        text: titleText + urlText + companyNameText + salaryText + jobIdText + '\n' + text,
        title,
        ttlCount,
        url,
    };
};

export const processIndeedJob = async (
    iter = 0,
    attempt = 0,
    crawler: EngineCrawler
): Promise<void> => {
    const crawlerOutOfJobs = crawler.jobsPerPage && iter > crawler.jobsPerPage;
    if (isCrawlerTerminated(crawler) || crawlerOutOfJobs) {
        void sendMessage(ChromeMessage.crawlerFinished);
        return;
    }

    const jobList = getJobListElements(SearchEngine.indeed);
    const jobsPerPage = jobList.length;
    // Which index on this page the iter pointing to
    const pageIter = iter % jobsPerPage;
    const job = jobList[pageIter];

    const clickable = job?.querySelector(IN_CLICKABLE_SELECTOR) as HTMLElement;
    if (!clickable) {
        return reattemptIndeedJob(iter, attempt, crawler);
    }
    clickable.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    click(clickable);

    // Wait to avoid Code 429 before copying code
    await sleep(1250);
    if (isCrawlerTerminated(crawler)) {
        void sendMessage(ChromeMessage.crawlerFinished);
        return;
    }

    const { companyName, jobId, text, title, ttlCount, url } = await copyIndeedJobData(job);
    if (isCrawlerTerminated(crawler)) {
        void sendMessage(ChromeMessage.crawlerFinished);
        return;
    }

    const summary: JobSummary = {
        companyName,
        jobId,
        title,
        source: SearchEngine.indeed,
        url,
    };

    const lastJobOnPage = jobsPerPage && iter % jobsPerPage === jobsPerPage - 1;

    await addJob(
        summary,
        text,
        {
            index: crawler.index + 1,
            page: lastJobOnPage ? crawler.page + 1 : crawler.page,
            jobsPerPage,
            ttlCount,
        },
        crawler
    );

    await crawlerStorage.update(SearchEngine.indeed, serializeCrawler(crawler));
    await sendMessage(ChromeMessage.crawlerProgress, {
        crawler: getCrawlerProgress(crawler),
    });
    if (lastJobOnPage) {
        // Go to next page
        const button: HTMLButtonElement | null = document.querySelector(
            IN_NEXT_PAGE_BUTTON_SELECTOR
        );
        if (!button || button.disabled) {
            void sendMessage(ChromeMessage.crawlerFinished);
        } else {
            click(button);
            void toast('Moving to next page...');
        }
    } else {
        await sleep(1500);
        return processIndeedJob(iter + 1, 0, crawler);
    }
};
