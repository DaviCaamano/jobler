import '@components/job-list/JobListOptions.css';
import { ClipboardX, ClipboardCheck } from 'lucide-react';

export const JobListOptions = () => {
    return (
        <div className="job-list-options_container">
            <button className="job-list-options_applied-button" onClick={() => {}}>
                <span>
                    Applied
                    <ClipboardCheck className="job-list-options_next-button-icon" />
                </span>
            </button>
            <button className="job-list-options_next-button" onClick={() => {}}>
                <span>
                    Skip
                    <ClipboardX className="job-list-options_next-button-icon" />
                </span>
            </button>
        </div>
    );
};
