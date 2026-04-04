import { EngineCrawler } from '@interfaces/crawler/crawler';
import {
    ZR_COMPANY_NAME_SELECTOR,
    ZR_JOB_DESCRIPTION_SELECTOR,
    ZR_JOB_ID_SELECTOR,
    ZR_JOB_SALARY_SELECTOR,
    ZR_JOB_TTL_AMT_SELECTOR,
    ZR_NEXT_PAGE_BUTTON_SELECTOR,
    ZR_TITLE_SELECTOR,
} from '@constants/crawler/crawler';
import { toast } from '@utils/crawler/toast';
import { sleep } from '@utils/sleep';
import {
    getJobListElements,
    getJobText,
    isCrawlerTerminated,
} from '@utils/crawler/processJob/sharedCrawlerGetters';
import { sendMessage } from '@utils/chrome/send-message';
import { ChromeMessage } from '@interfaces/tab-messages';
import { SearchEngine } from '@interfaces/search-engine';
import { click } from '@utils/crawler/click';
import { JobSummary } from '@interfaces/job-list';
import { addJob, serializeCrawler } from '@utils/crawler/crawlerProgress';

const MAX_JOB_COPY_ATTEMPTS = 5;
const MAX_JOB_PROCESS_ATTEMPTS = 10;

const reattemptZipRecruiterJob = async (iter: number, attempt: number, crawler: EngineCrawler) => {
    if (attempt >= MAX_JOB_PROCESS_ATTEMPTS) {
        void toast(`Unable to load Job #${iter + 1} on list, Skipping...`);
        return processZipRecruiterJob(iter + 1, attempt + 1, crawler);
    } else {
        await sleep(500);
        return processZipRecruiterJob(iter, attempt + 1, crawler);
    }
};

const getZipRecruiterJobTitle = (job: HTMLElement) => {
    const titleElement = job.querySelector(ZR_TITLE_SELECTOR) as HTMLElement;
    const title = titleElement?.textContent.trim();
    const titleText = title ? `\nTITLE: ${title}\n` : '';
    return { titleElement, title, titleText };
};

const getZipRecruiterJobSalary = (job: HTMLElement) => {
    const jobInfoButtons = job.querySelector(ZR_JOB_SALARY_SELECTOR) as HTMLElement;
    const salary = jobInfoButtons?.innerText || jobInfoButtons?.textContent || '';
    const salaryText = salary ? `\nSALARY: ${salary}\n` : '';
    return { salary, salaryText };
};

const getZipRecruiterJobCompanyName = (job: HTMLElement) => {
    const companyNameElement = job.querySelector(ZR_COMPANY_NAME_SELECTOR) as HTMLElement;
    const companyName = (
        companyNameElement?.innerText ||
        companyNameElement?.textContent ||
        ''
    ).trim();
    const companyNameText = companyName ? `\nCompany_Name: ${companyName}\n` : '';
    return { companyName, companyNameText };
};

const getZipRecruiterJobId = (job: HTMLElement) => {
    const id = job.querySelector(ZR_JOB_ID_SELECTOR)?.id?.replace('job-card-', '');
    if (!id) {
        return { jobId: '', idText: '' };
    }
    return { jobId: id, jobIdText: id ? `\nJob_ID: ZR-${id}\n` : '' };
};

const getZipRecruiterJobTtlAmt = (): number => {
    const jobTtlAmtSpan = document.querySelector(ZR_JOB_TTL_AMT_SELECTOR) as HTMLElement;
    return parseInt(
        (
            jobTtlAmtSpan.innerText ||
            jobTtlAmtSpan.textContent ||
            jobTtlAmtSpan.innerHTML ||
            ''
        ).replace(/\D/g, '')
    );
};

const copyZipRecruiterJob = async (
    job: HTMLElement,
    titleText: string,
    titleElement: HTMLElement,
    attempt = 0
): Promise<{
    companyName: string;
    jobId: string;
    text: string;
    ttlCount: number;
    url: string;
}> => {
    const reattemptCopy = async () => {
        if (attempt < MAX_JOB_COPY_ATTEMPTS) {
            await sleep(500);
            return copyZipRecruiterJob(job, titleText, titleElement, attempt + 1);
        } else {
            void toast('Job data unavailable. skipping.');
            return {
                companyName: '',
                jobId: '',
                text: '',
                ttlCount: 0,
                url: '',
            };
        }
    };
    const jobDescription = document.querySelector(ZR_JOB_DESCRIPTION_SELECTOR) as HTMLElement;
    if (!jobDescription) {
        return reattemptCopy();
    }
    const text = getJobText(jobDescription);
    if (!text) {
        return reattemptCopy();
    }
    const { salaryText } = getZipRecruiterJobSalary(job);
    const { companyName, companyNameText } = getZipRecruiterJobCompanyName(job);
    if (!companyName) {
        return reattemptCopy();
    }
    const { jobId, jobIdText } = getZipRecruiterJobId(job);
    if (!jobId) {
        return reattemptCopy();
    }
    const url = `https://www.ziprecruiter.com/jobseeker/home?lk=${jobId}`;
    const urlText = `\n${url}\n`;

    return {
        companyName,
        jobId,
        text: titleText + urlText + companyNameText + salaryText + jobIdText + '\n' + text,
        ttlCount: getZipRecruiterJobTtlAmt(),
        url,
    };
};

export const processZipRecruiterJob = async (
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

    const { titleElement, title, titleText } = getZipRecruiterJobTitle(job);
    if (!titleElement || !title) {
        return reattemptZipRecruiterJob(iter, attempt, crawler);
    }
    titleElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
    click(titleElement);

    // Wait to avoid Code 429 before copying code
    await sleep(1000);
    if (isCrawlerTerminated(crawler)) {
        void sendMessage(ChromeMessage.crawlerFinished);
        return;
    }

    const { companyName, jobId, text, ttlCount, url } = await copyZipRecruiterJob(
        job,
        titleText,
        titleElement
    );
    if (isCrawlerTerminated(crawler)) {
        void sendMessage(ChromeMessage.crawlerFinished);
        return;
    }

    const summary: JobSummary = {
        companyName,
        jobId,
        title,
        source: SearchEngine.ziprecruiter,
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
    await sendMessage(
        ChromeMessage.crawlerProgress,
        serializeCrawler(await addJob(summary, text, updatedCrawler))
    );
    if (lastJobOnPage) {
        // Go to next page
        const button: HTMLButtonElement | null = document.querySelector(
            ZR_NEXT_PAGE_BUTTON_SELECTOR
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
            return processZipRecruiterJob(0, 0, crawler);
        }
    } else {
        return processZipRecruiterJob(iter + 1, 0, crawler);
    }
};
