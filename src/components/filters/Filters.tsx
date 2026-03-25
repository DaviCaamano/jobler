import '@components/filters/Filters.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { loadFromStorage, saveToStorage, Storage } from '@utils/storage';

type FilterType = Storage.blackList | Storage.whiteList | null;
interface FiltersProps {
    activeFilter?: FilterType;
}
export const Filters = ({ activeFilter }: FiltersProps) => {
    const stickActiveFilter = useRef<FilterType>(activeFilter);
    const expandedClass =
        activeFilter === Storage.blackList
            ? Storage.blackList
            : activeFilter === Storage.whiteList
              ? Storage.whiteList
              : null;

    const [filterItems, setFilterItems] = useState<string[]>([]);

    // Update the list of filtered items every time the active filter changes.
    useEffect(() => {
        if (stickActiveFilter.current !== activeFilter) {
            stickActiveFilter.current = activeFilter;
            if (activeFilter === null) {
                setFilterItems([]);
            } else {
                loadFromStorage<string[]>(activeFilter!).then((items: string[] | undefined) => {
                    setFilterItems(items || []);
                });
            }
        }
    }, [activeFilter]);

    // Delete an entry from the filter
    const onDelete = useCallback(
        async (deletedFilter: string) => {
            const newFilters = filterItems.filter((item) => item !== deletedFilter);

            if (activeFilter === Storage.blackList) {
                await saveToStorage(Storage.blackList, newFilters);
            } else if (activeFilter === Storage.whiteList) {
                await saveToStorage(Storage.whiteList, newFilters);
            }
        },
        [activeFilter]
    );
    return (
        <>
            {filterItems.map((item: string, index: number) => (
                <FilterItem item={item} key={item + '-' + index} onDelete={onDelete} />
            ))}
        </>
    );
};

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
