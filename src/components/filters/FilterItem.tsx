import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface FilterItemProps {
    item: string;
    onDelete: (name: string) => void;
}
export const FilterItem = ({ item, onDelete }: FilterItemProps) => {
    return (
        <div className="filters_item">
            <div className="filters_name">{item}</div>
            <div className="filters_delete-button-container" onClick={() => onDelete(item)}>
                <FontAwesomeIcon icon={faTrash} />
            </div>
        </div>
    );
};
