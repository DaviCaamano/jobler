import '@components/job-list/JobListOptions.css';
import { faClipboard, faClipboardCheck, faForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const JobListOptions = () => {
    return (
        <div className="__jobler_job-list-options_container">
            <div className="__jobler_job-list-options_button-row">
                <div className="__jobler_job-list-options_applied-button-container">
                    <div className="__jobler_job-list-options_applied-button-shadow">
                        <button
                            className="__jobler_job-list-options_applied-button"
                            onClick={() => {}}
                        >
                            <span>
                                Applied
                                <FontAwesomeIcon
                                    className="__jobler_job-list-options_next-button-icon"
                                    icon={faClipboardCheck}
                                />
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
                                <FontAwesomeIcon
                                    className="__jobler_job-list-options_next-button-icon"
                                    icon={faClipboard}
                                />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
