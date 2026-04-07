import { SearchEngine } from '@interfaces/search-engine';
import { JobSummary } from '@interfaces/job-list';
import {
    CrawlerProgress,
    EngineCrawler,
    EngineCrawlerState,
    JobFilters,
    PartialJobFilters,
} from '@interfaces/crawler/crawler';
import { DEFAULT_JOB_FILTERS } from '@constants/crawler/crawler';
import { csvToJsonArray } from '@utils/csvToJsonArray';
import { toast } from '@utils/crawler/toast';
import Papa from 'papaparse';

export const wordExists = (word: string, text: string) =>
    new RegExp(
        `(^|[^a-z0-9])${word.toLowerCase().replace(/[*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^a-z0-9])`
    ).test(text.toLowerCase());
export const passesWhiteList = (word: string | RegExp, text: string) =>
    (typeof word === 'string' && wordExists(word, text)) ||
    (word instanceof RegExp && word.test(text));
export const passesBlackList = (word: string | RegExp, text: string) =>
    (typeof word === 'string' && !wordExists(word, text)) ||
    (word instanceof RegExp && !word.test(text));

export const checkFilters = async ({
    companyName,
    filters,
    text,
    title,
}: {
    text: string;
    title: string;
    companyName: string;
    filters: JobFilters;
}) => {
    const reasons: string[] = [];
    for (const filter of filters.whiteList.text) {
        if (!passesWhiteList(filter, text)) {
            reasons.push(`Missing word: ${filter}`);
        }
    }
    for (const filter of filters.whiteList.title) {
        if (!passesWhiteList(filter, title)) {
            reasons.push(`Missing title: ${filter}`);
        }
    }
    for (const filter of filters.whiteList.company) {
        if (!passesWhiteList(filter, companyName)) {
            reasons.push(`Missing company name: ${filter}`);
        }
    }
    for (const filter of filters.blackList.text) {
        if (!passesBlackList(filter, text)) {
            reasons.push(`Banned word: ${filter}`);
        }
    }
    for (const filter of filters.blackList.title) {
        if (!passesBlackList(filter, title)) {
            reasons.push(`Banned title: ${filter}`);
        }
    }
    for (const filter of filters.blackList.company) {
        if (!passesBlackList(filter, companyName)) {
            reasons.push(`Banned company name: ${filter}`);
        }
    }
    if (reasons.length > 0) {
        await toast('Skipping Job ' + reasons.join('\n'));
        return false;
    }
    return true;
};

export const createCrawler = async ({
    engine,
    filters,
    index,
    isRunning,
    jobList,
    jobsPerPage,
    page,
    processedCount,
    skippedCount,
    startTime,
    ttlCount,
}: {
    engine: SearchEngine;
    filters?: PartialJobFilters;
    index?: number;
    isRunning?: boolean;
    jobList?: JobSummary[] | string;
    jobsPerPage?: number;
    page?: number;
    processedCount?: number;
    skippedCount?: number;
    startTime?: number;
    ttlCount?: number;
}): Promise<EngineCrawler> => {
    return {
        engine,
        filters: {
            blackList: {
                ...DEFAULT_JOB_FILTERS.blackList,
                ...filters?.blackList,
            },
            whiteList: {
                ...DEFAULT_JOB_FILTERS.whiteList,
                ...filters?.whiteList,
            },
        },
        index: index ?? 0,
        isRunning: isRunning ?? false,
        jobList:
            typeof jobList === 'string'
                ? ((await csvToJsonArray(jobList)) as unknown as JobSummary[])
                : (jobList ?? []),
        jobsPerPage: jobsPerPage ?? 0,
        page: page ?? 0,
        processedCount: processedCount ?? 0,
        skippedCount: skippedCount ?? 0,
        startTime,
        ttlCount,
    };
};

export type UpdatingCrawler = Partial<
    Omit<EngineCrawler, 'engine'> & {
        jobList: JobSummary[] | string;
    }
>;
export const updateCrawler = async (
    {
        filters,
        index,
        isRunning,
        jobList,
        jobsPerPage,
        page,
        processedCount,
        skippedCount,
        startTime,
    }: UpdatingCrawler,
    current: EngineCrawler
): Promise<void> => {
    current.filters = {
        blackList: {
            ...DEFAULT_JOB_FILTERS.whiteList,
            ...current?.filters?.blackList,
            ...filters?.blackList,
        },
        whiteList: {
            ...DEFAULT_JOB_FILTERS.whiteList,
            ...current?.filters?.whiteList,
            ...filters?.whiteList,
        },
    };
    current.index = index ?? current.index ?? 0;
    current.isRunning = isRunning ?? current.isRunning ?? false;
    current.jobList = jobList
        ? typeof jobList === 'string'
            ? ((await csvToJsonArray(jobList)) as unknown as JobSummary[])
            : (jobList ?? [])
        : (current.jobList ?? []);
    current.jobsPerPage = jobsPerPage ?? 0;
    current.page = page ?? current.page ?? 0;
    current.processedCount = processedCount ?? current.processedCount ?? 0;
    current.skippedCount = skippedCount ?? current.page ?? 0;
    current.startTime = startTime ?? current.startTime;
};

export const addJob = async (
    job: JobSummary,
    text: string,
    updatedCrawler: Partial<EngineCrawler>,
    crawler: EngineCrawler
): Promise<void> => {
    const jobExists = (updatedCrawler?.jobList ?? crawler.jobList)?.find(
        (currentJob: JobSummary) => currentJob.jobId === job.jobId
    );

    if (!jobExists) {
        const { companyName, title } = job;
        if (
            await checkFilters({
                text,
                title,
                companyName,
                filters: updatedCrawler.filters || crawler.filters,
            })
        ) {
            updateCrawler(
                {
                    ...updatedCrawler,
                    jobList: [...(updatedCrawler?.jobList ?? crawler?.jobList ?? []), job],
                    processedCount: crawler.processedCount + 1,
                },
                crawler
            );
        }
    }
    updateCrawler(
        {
            skippedCount: crawler.skippedCount + 1,
        },
        crawler
    );
};

// Convert EngineCrawler (an interface used by the crawler content script)
// to CrawlerProgress (an interface used to display progress in the crawler progress popup)
export const getCrawlerProgress = (progress: EngineCrawler): CrawlerProgress => {
    const elapsedTime = progress.startTime
        ? new Date(Date.now() - new Date(progress.startTime).getTime())
        : undefined;

    let remainingTime: string | undefined;
    if (progress.index > 0 && elapsedTime) {
        const elapsedMs = elapsedTime.getTime();
        const avgMsPerJob = elapsedMs / progress.index;
        const remainingJobs = Math.max(progress.jobList.length - progress.index, 0);
        const remainingMs = Math.max(0, Math.round(avgMsPerJob * remainingJobs));

        remainingTime = new Date(remainingMs).toISOString().slice(11, 19);
    }

    return {
        elapsedTime: elapsedTime ? elapsedTime.toISOString().slice(11, 19) : undefined,
        index: progress.index,
        isRunning: progress.isRunning,
        page: progress.page,
        processedCount: progress.processedCount,
        remainingTime,
        skippedCount: progress.skippedCount,
        ttlCount: progress.jobList.length,
    };
};

export const jobListToCsv = (jobList: JobSummary[], includeHeaders: boolean = true): string => {
    return Papa.unparse(jobList, {
        header: includeHeaders,
    });
};

export const serializeCrawler = (progress: EngineCrawler): EngineCrawlerState => ({
    ...progress,
    jobList: jobListToCsv(progress.jobList),
    startTime: progress.startTime,
});
