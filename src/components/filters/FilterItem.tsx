import { OctagonX } from 'lucide-react';
import { FilterEntry } from '@interfaces/filters-store';

interface FilterItemProps {
    item: FilterEntry;
    onDelete: (filterEntry: FilterEntry) => void;
}
export const FilterItem = ({ item, onDelete }: FilterItemProps) => {
    const text = typeof item === 'string' ? item : String(item);
    return (
        <div className="filters_item">
            <div className="filters_name">{text}</div>
            <div className="filters_delete-button-container" onClick={() => onDelete(item)}>
                <div className="filters_delete-button-framer">
                    <OctagonX height={18} width={18} />
                </div>
            </div>
        </div>
    );
};
