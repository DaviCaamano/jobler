import { SearchEngine, SupportedEngines } from '@interfaces/search-engine';
import { JobSummary } from '@interfaces/job-list';
import { CrawlerProgress, EngineCrawler, EngineCrawlerState } from '@interfaces/crawler/crawler';
import { DEFAULT_JOB_FILTERS } from '@constants/crawler/crawler';
import { csvToJsonArray } from '@utils/csvToJsonArray';
import { toast } from '@utils/crawler/toast';
import Papa from 'papaparse';
import {
    FilterCategories,
    FiltersStore,
    FiltersStrategy,
    PartialFiltersStore,
} from '@interfaces/filters-store';
import { crawlerStorage } from '@stores/crawler.store';
import { ChromeMessage } from '@interfaces/tab-messages';
import { sendMessage } from '@utils/chrome/send-message';

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
    filters: FiltersStore;
}) => {
    const reasons: string[] = [];
    for (const filter of filters[FiltersStrategy.whiteList][FilterCategories.text]) {
        if (!passesWhiteList(filter, text)) {
            reasons.push(`Missing word: ${filter}`);
        }
    }
    for (const filter of filters[FiltersStrategy.whiteList][FilterCategories.title]) {
        if (!passesWhiteList(filter, title)) {
            reasons.push(`Missing title: ${filter}`);
        }
    }
    for (const filter of filters[FiltersStrategy.whiteList][FilterCategories.company]) {
        if (!passesWhiteList(filter, companyName)) {
            reasons.push(`Missing company name: ${filter}`);
        }
    }
    for (const filter of filters[FiltersStrategy.blackList][FilterCategories.text]) {
        if (!passesBlackList(filter, text)) {
            reasons.push(`Banned word: ${filter}`);
        }
    }
    for (const filter of filters[FiltersStrategy.blackList][FilterCategories.title]) {
        if (!passesBlackList(filter, title)) {
            reasons.push(`Banned title: ${filter}`);
        }
    }
    for (const filter of filters[FiltersStrategy.blackList][FilterCategories.company]) {
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
    filters?: PartialFiltersStore;
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
            void updateCrawler(
                {
                    ...updatedCrawler,
                    jobList: [...(updatedCrawler?.jobList ?? crawler?.jobList ?? []), job],
                    processedCount: crawler.processedCount + 1,
                },
                crawler
            );
            return;
        }
    }
    void updateCrawler(
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

export const updateCrawlerProgress = async (
    engine: SupportedEngines,
    crawler: EngineCrawler
): Promise<void> => {
    await crawlerStorage.update(engine, serializeCrawler(crawler));
    return sendMessage(ChromeMessage.crawlerProgress, {
        crawler: getCrawlerProgress(crawler),
    });
};
