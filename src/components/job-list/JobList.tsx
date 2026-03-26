import '@components/job-list/JobList.css';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JobListOptions } from '@components/job-list/JobListOptions';
import { JobSummary } from '@utils/stores';

interface JobListProps {
    jobList: JobSummary[];
}
export const JobList = ({ jobList }: JobListProps) => {
    return (
        <>
            <div id={'job-list_container'}>
                <div id={'job-list_job-table'}>
                    <div id={'job-list_job-table'}>
                        {jobList.map(({ companyName, title, url }: JobSummary, index: number) => (
                            <JobListItem
                                companyName={companyName}
                                title={title}
                                url={url}
                                key={`${companyName}-${title}-${index}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <JobListOptions />
        </>
    );
};

export const JobListItem = ({ companyName, title, url }: JobSummary) => {
    return (
        <div className="job-list_job">
            <div className="job-list_company-name">{companyName}</div>
            <div className="job-list_title">{title}</div>
            <a href={url} target="_blank" className="job-list_job-link">
                <div className="job-list_job-link-box">
                    <FontAwesomeIcon className="job-list_job-link-icon" icon={faLink} />
                </div>
            </a>
        </div>
    );
};
