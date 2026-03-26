import '@components/job-list/JobList.css';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JobListOptions } from '@components/job-list/JobListOptions';
import { JobTable } from '@components/menu/JobTable';
import { JobSummary } from '@utils/stores';

interface JobListProps {
    jobList: JobSummary[];
}
export const JobList = ({ jobList }: JobListProps) => {
    return (
        <>
            <JobTable>
                <div id={'__jobler__job-list_job-table'}>
                    {jobList.map(({ companyName, title, url }: JobSummary, index: number) => (
                        <JobListItem
                            companyName={companyName}
                            title={title}
                            url={url}
                            key={`${companyName}-${title}-${index}`}
                        />
                    ))}
                </div>
            </JobTable>
            <JobListOptions />
        </>
    );
};

export const JobListItem = ({ companyName, title, url }: JobSummary) => {
    return (
        <div className="__jobler__job-list_job">
            <div className="__jobler__job-list_company-name">{companyName}</div>
            <div className="__jobler__job-list_title">{title}</div>
            <a href={url} target="_blank" className="__jobler__job-list_job-link">
                <div className="__jobler__job-list_job-link-box">
                    <FontAwesomeIcon className="__jobler__job-list_job-link-icon" icon={faLink} />
                </div>
            </a>
        </div>
    );
};
