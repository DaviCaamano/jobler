import '@components/job-list/JobListOptions.css';
import { ClipboardX, ClipboardCheck } from 'lucide-react';

interface JobListOptionsProps {
    locked: boolean;
}
export const JobListOptions = ({ locked = true }: JobListOptionsProps) => {
    return (
        <div className="job-list-options_container">
            <button
                className="job-list-options_applied-button"
                onClick={() => {}}
                disabled={locked}
            >
                Applied
                <ClipboardCheck className="job-list-options_next-button-icon" />
            </button>
            <button className="job-list-options_next-button" onClick={() => {}} disabled={locked}>
                Skip
                <ClipboardX className="job-list-options_next-button-icon" />
            </button>
        </div>
    );
};
