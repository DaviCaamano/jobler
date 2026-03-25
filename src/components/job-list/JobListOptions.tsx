import '@components/job-list/JobListOptions.css';
import { Filters } from '@components/filters/Filters';
import { useState } from 'react';
import { Storage } from '@utils/storage';
import { faClipboard, faClipboardCheck, faForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const JobListOptions = () => {
    const [filterType, setFilterType] = useState<Storage.blackList | Storage.whiteList | null>(
        null
    );
    return (
        <div className="__jobler_job-list-options_container">
            <Filters activeFilter={filterType} />
            <div className="__jobler_job-list-options_button-row">
                <div className="__jobler_job-list-options_applied-button-container">
                    <div className="__jobler_job-list-options_applied-button-shadow">
                        <button
                            className="__jobler_job-list-options_applied-button"
                            onClick={() => {}}
                        >
                            <span>
                                Applied <FontAwesomeIcon icon={faClipboardCheck} />
                            </span>
                        </button>
                    </div>
                </div>
                <div className="__jobler_job-list-options_next-button-container">
                    <div className="__jobler_job-list-options_next-button-shadow">
                        <button
                            className="__jobler_job-list-options_next-button"
                            onClick={() => {}}
                        >
                            <span>
                                Skip
                                <FontAwesomeIcon icon={faClipboard} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
