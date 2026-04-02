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
import { writeToString } from '@fast-csv/format';

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

export const checkFilters = async (
    text: string,
    title: string,
    companyName: string,
    filters: JobFilters
) => {
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
        if (!passesBlackList(filter, companyName)) {
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
    page?: number;
    processedCount?: number;
    skippedCount?: number;
    startTime?: Date;
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
        page: page ?? 0,
        processedCount: processedCount ?? 0,
        skippedCount: skippedCount ?? 0,
        startTime: startTime ? new Date(startTime) : undefined,
        ttlCount,
    };
};

type UpdatingCrawler = Partial<Omit<EngineCrawler, 'engine'>> & { jobList: JobSummary[] | string };
export const updateCrawler = async (
    engine: SearchEngine,
    {
        filters,
        index,
        isRunning,
        jobList,
        page,
        processedCount,
        skippedCount,
        startTime,
    }: UpdatingCrawler,
    current?: EngineCrawler
): Promise<EngineCrawler> => {
    const newCrawler = current
        ? {
              ...current,
          }
        : await createCrawler({ engine });

    return {
        ...newCrawler,
        filters: {
            blackList: {
                ...DEFAULT_JOB_FILTERS.whiteList,
                ...newCrawler?.filters?.blackList,
                ...filters?.blackList,
            },
            whiteList: {
                ...DEFAULT_JOB_FILTERS.whiteList,
                ...newCrawler?.filters?.whiteList,
                ...filters?.whiteList,
            },
        },
        index: index ?? newCrawler.index ?? 0,
        isRunning: isRunning ?? newCrawler.isRunning ?? false,
        jobList: jobList
            ? typeof jobList === 'string'
                ? ((await csvToJsonArray(jobList)) as unknown as JobSummary[])
                : (jobList ?? [])
            : (newCrawler.jobList ?? []),
        page: page ?? newCrawler.page ?? 0,
        processedCount: processedCount ?? newCrawler.processedCount ?? 0,
        skippedCount: skippedCount ?? newCrawler.page ?? 0,
        startTime: startTime ?? newCrawler.startTime,
    };
};

export const addJob = async (job: JobSummary, text: string, progress: EngineCrawler) => {
    const jobExists = progress?.jobList?.find(
        (currentJob: JobSummary) => currentJob.jobId === job.jobId
    );
    if (!jobExists) {
        const { companyName, title } = job;
        if (await checkFilters(text, title, companyName, progress.filters)) {
            return updateCrawler(progress.engine, {
                ...progress,
                jobList: [...(progress?.jobList ?? []), job],
                processedCount: progress.processedCount + 1,
            });
        } else {
            return updateCrawler(progress.engine, {
                ...progress,
                skippedCount: progress.skippedCount + 1,
            });
        }
    }
};

export const getCrawlerProgress = async (progress: EngineCrawler): Promise<CrawlerProgress> => {
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

export const jobListToCsv = (jobList: JobSummary[], includeHeaders: boolean = true) => {
    return writeToString(jobList, { headers: includeHeaders });
};

export const serializeCrawler = async (progress: EngineCrawler): Promise<EngineCrawlerState> => ({
    ...progress,
    jobList: await jobListToCsv(progress.jobList),
    startTime: progress.startTime,
});
