import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface FilterItemProps {
    item: string;
    onDelete: (name: string) => void;
}
export const FilterItem = ({ item, onDelete }: FilterItemProps) => {
    return (
        <div className="__jobler__filters_item">
            <div className="__jobler__filters_name">{item}</div>
            <div
                className="__jobler__filters_delete-button-container"
                onClick={() => onDelete(item)}
            >
                <FontAwesomeIcon icon={faTrash} />
            </div>
        </div>
    );
};
