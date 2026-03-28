import '@components/job-list/JobList.css';
import { CircleDashed, BadgeCheck } from 'lucide-react';
import { JobListOptions } from '@components/job-list/JobListOptions';
import { startTransition, useOptimistic } from 'react';
import { JobSummary } from '@interfaces/job-list';

interface JobListProps {
    crawlerActive: boolean;
    show: boolean;
    jobList: JobSummary[];
}
export const JobList = ({ crawlerActive, show, jobList }: JobListProps) => {
    const markApplied = (jobId: string) => {
        // TODO Make this function mark the job as applied
    };

    return (
        <>
            <div id={'job-list_container'} style={{ display: show ? 'block' : 'none' }}>
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
            <JobListOptions show={show} locked={crawlerActive || jobList.length === 0} />
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
                <div className="job-list_delete-button-framer">
                    {optimisticallyApplied ? (
                        <BadgeCheck height={18} width={18} />
                    ) : (
                        <CircleDashed height={18} width={18} />
                    )}
                </div>
            </div>
        </div>
    );
};
