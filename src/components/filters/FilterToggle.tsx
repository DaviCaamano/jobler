import '@components/filters/FilterToggle.css';
import { JobTableList } from '@interfaces/job-list';
import { Setter } from '@interfaces/react-state';

interface FilterToggleProps {
    list: JobTableList;
    setList: Setter<JobTableList>;
}
export const FilterToggle = ({ list, setList }: FilterToggleProps) => {
    const handleToggle = () => {
        setList(list === JobTableList.jobList ? JobTableList.filters : JobTableList.jobList);
    };

    const toggled = list === JobTableList.jobList;

    return (
        <div className="__jobler__filter-toggle_container">
            <button
                className={`__jobler__filter-toggle_toggle ${toggled ? 'on' : 'off'}`}
                onClick={handleToggle}
                aria-pressed={list === JobTableList.filters}
                type="button"
            >
                <span className={`__jobler__filter-toggle_toggle-label ${toggled ? 'off' : 'on'}`}>
                    Job List
                </span>
                <span className="__jobler__filter-toggle_toggle-track">
                    <span className="__jobler__filter-toggle_toggle-thumb" />
                </span>
                <span className={`__jobler__filter-toggle_toggle-label ${toggled ? 'on' : 'off'}`}>
                    Filters
                </span>
            </button>
        </div>
    );
};
