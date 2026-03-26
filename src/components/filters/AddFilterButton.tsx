import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface AddFilterButton {}
export const AddFilterButton = () => {
    const [showInput, setShowInput] = useState<boolean>(false);
    return (
        <div className="add-filter-button_container">
            <button className="add-filter-button_button" onClick={() => {}}>
                <FontAwesomeIcon className="add-filter-button_icon" icon={faCirclePlus} />
            </button>
        </div>
    );
};
