import '@components/job-list/JobListOptions.css';

interface JobListOptionsProps {
    locked: boolean;
}
export const JobListOptions = ({ locked = true }: JobListOptionsProps) => {
    return (
        <div className="job-list-options_container">
            <button
                className="job-list-options_applied-button button-lighting"
                onClick={() => {}}
                disabled={locked}
            >
                Start Hunt
            </button>
        </div>
    );
};
