import { storage } from '@stores/storage';
import { JobSummary } from '@interfaces/job-list';
import { Stores } from '@interfaces/store';

const dedupeJobSummaries = (jobs: JobSummary[]) => {
    const seen = new Set<string>();
    const result: JobSummary[] = [];

    jobs.forEach((job) => {
        const key =
            job.jobId?.trim() ||
            job.url?.trim() ||
            `${job.companyName.toLowerCase()}::${job.title.toLowerCase()}`;

        if (!key || seen.has(key)) return;

        seen.add(key);
        result.push(job);
    });

    return result;
};

export const jobStorage = {
    async getAll() {
        return storage.get(Stores.jobList);
    },

    async saveAll(jobSummaries: JobSummary[]) {
        const deduped = dedupeJobSummaries(jobSummaries);
        await storage.set(Stores.jobList, deduped);
        return deduped;
    },

    async upsert(jobSummary: JobSummary) {
        return storage.patch(Stores.jobList, (currentJobs: JobSummary[]) => {
            const index = currentJobs.findIndex(
                (job) =>
                    (job.jobId && job.jobId === jobSummary.jobId) ||
                    (job.url && job.url === jobSummary.url)
            );

            if (index === -1) {
                return dedupeJobSummaries([...currentJobs, jobSummary]);
            }

            const nextJobs = [...currentJobs];
            nextJobs[index] = { ...nextJobs[index], ...jobSummary };
            return dedupeJobSummaries(nextJobs);
        });
    },

    async markApplied(jobId: string, applied: boolean) {
        return storage.patch(Stores.jobList, (currentJobs: JobSummary[]) =>
            currentJobs.map((job) => (job.jobId === jobId ? { ...job, applied } : job))
        );
    },

    async clear() {
        await storage.set(Stores.jobList, []);
    },
};
