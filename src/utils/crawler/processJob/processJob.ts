import { EngineCrawler } from '@interfaces/crawler/crawler';
import { SearchEngine } from '@interfaces/search-engine';
import { processLinkedInJob } from '@utils/crawler/processJob/processLinkedInJob';
import { processZipRecruiterJob } from '@utils/crawler/processJob/processZipRecruiterJob';
import { processIndeedJob } from '@utils/crawler/processJob/processIndeedJob';

export const processJob = async (crawler: EngineCrawler): Promise<void> => {
    switch (crawler.engine) {
        case SearchEngine.linkedin:
            return processLinkedInJob(0, 0, crawler);
        case SearchEngine.ziprecruiter:
            return processZipRecruiterJob(0, 0, crawler);
        case SearchEngine.indeed:
            return processIndeedJob(0, 0, crawler);
    }
};
