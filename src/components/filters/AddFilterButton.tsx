import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface AddFilterButton {}
export const AddFilterButton = () => {
    const [showInput, setShowInput] = useState<boolean>(false);
    return (
        <div className="__jobler__add-filter-button_container">
            <button>
                <div style={{ marginRight: '0.5rem ' }}>New</div>
                <FontAwesomeIcon className="__jobler__add-filter-button_icon" icon={faCirclePlus} />
            </button>
        </div>
    );
};
