import '@components/job-list/JobListOptions.css';

interface JobListOptionsProps {
    locked: boolean;
    show: boolean;
}
export const JobListOptions = ({ locked = true, show }: JobListOptionsProps) => {
    return (
        <div className="job-list-options_container" style={{ display: show ? 'flex' : 'none' }}>
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
