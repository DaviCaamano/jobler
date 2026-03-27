import '@components/job-list/JobList.css';
import { CircleDashed, BadgeCheck } from 'lucide-react';
import { JobListOptions } from '@components/job-list/JobListOptions';
import { JobSummary } from '@utils/stores';
import { startTransition, useOptimistic } from 'react';

interface JobListProps {
    jobList: JobSummary[];
    crawlerActive: boolean;
}
export const JobList = ({ crawlerActive, jobList }: JobListProps) => {
    const markApplied = (jobId: string) => {
        // TODO Make this function mark the job as applied
    };

    return (
        <>
            <div id={'job-list_container'}>
                <div className={'job-list_job-table'}>
                    {jobList.map((job: JobSummary, index: number) => (
                        <JobListItem
                            {...job}
                            key={`${job.title}-${index}`}
                            markApplied={markApplied}
                        />
                    ))}
                </div>
            </div>
            <JobListOptions locked={crawlerActive || jobList.length === 0} />
        </>
    );
};

interface JobListItemProps extends JobSummary {
    markApplied: (jobId: string) => void;
}
export const JobListItem = ({
    applied,
    companyName,
    jobId,
    markApplied,
    title,
    url,
    source,
}: JobListItemProps) => {
    const [optimisticallyApplied, setOptimisticallyApplied] = useOptimistic<boolean>(false);
    const onClick = () => {
        startTransition(() => {
            setOptimisticallyApplied(true);
            markApplied(jobId);
        });
    };
    return (
        <div className="job-list_item">
            <div className="job-list_name">{companyName}</div>
            <div className="job-list_title">{companyName}</div>
            <div className="job-list_delete-button-container" onClick={onClick}>
                {optimisticallyApplied ? (
                    <BadgeCheck height={18} width={18} />
                ) : (
                    <CircleDashed height={18} width={18} />
                )}
            </div>
        </div>
    );
};
