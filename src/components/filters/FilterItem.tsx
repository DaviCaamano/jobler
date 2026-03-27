import { OctagonX } from 'lucide-react';

interface FilterItemProps {
    item: string;
    onDelete: (name: string) => void;
}
export const FilterItem = ({ item, onDelete }: FilterItemProps) => {
    return (
        <div className="filters_item">
            <div className="filters_name">{item}</div>
            <div className="filters_delete-button-container" onClick={() => onDelete(item)}>
                <div className="filters_delete-button-framer">
                    <OctagonX height={18} width={18} />
                </div>
            </div>
        </div>
    );
};
