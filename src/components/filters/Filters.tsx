import '@components/filters/Filters.css';
import { useCallback, useState } from 'react';
import { loadFromStorage, saveToStorage, Storage } from '@utils/storage';
import { useSticky } from '@hooks/useSticky';
import { Toggle } from '@components/shared/toggle/Toggle';
import { FilterItem } from '@components/filters/FilterItem';
import { FilterCategoryButton } from '@components/filters/FilterCategoryButton';

type FilterType = Storage.blackList | Storage.whiteList;

export const Filters = () => {
    const [filter, setFilter] = useState<FilterType>(Storage.whiteList);
    const [filterList, setFilterList] = useState<string[]>([]);

    useSticky(
        filter,
        useCallback(() => {
            loadFromStorage<string[]>(filter!).then((items: string[] | undefined) => {
                setFilterList(items || []);
            });
        }, [])
    );

    // Delete an entry from the filter
    const onDelete = useCallback(
        async (deletedFilter: string) => {
            const newFilters = filterList.filter((item) => item !== deletedFilter);
            await saveToStorage(
                filter === Storage.blackList ? Storage.blackList : Storage.whiteList,
                newFilters
            );
        },
        [filter]
    );

    return (
        <>
            <div className="__jobler__filters_toggle-container">
                <Toggle
                    setValue={setFilter}
                    values={{ on: Storage.blackList, off: Storage.whiteList }}
                    defaultValue={Storage.blackList}
                    labels={{ on: 'Black List', off: 'White List' }}
                    heightRem={2.25}
                    widthRem={7.25}
                />
            </div>
            <FilterCategoryButton />
            {filterList.map((item: string, index: number) => (
                <FilterItem item={item} key={item + '-' + index} onDelete={onDelete} />
            ))}
        </>
    );
};
