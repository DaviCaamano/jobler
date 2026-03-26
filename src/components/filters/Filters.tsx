import '@components/filters/Filters.css';
import { useCallback, useState } from 'react';
import {
    FilterCategories,
    FilterStore,
    loadFromStorage,
    saveToStorage,
    Stores,
} from '@utils/stores';
import { useSticky } from '@hooks/useSticky';
import { Toggle } from '@components/shared/toggle/Toggle';
import { FilterItem } from '@components/filters/FilterItem';
import { FilterCategoryButton } from '@components/filters/FilterCategoryButton';
import { JobTable } from '@components/menu/JobTable';

type FilterType = Stores.blackList | Stores.whiteList;

export const Filters = () => {
    const [filter, setFilter] = useState<FilterType>(Stores.whiteList);
    const [filterCategory, setFilterCategory] = useState<FilterCategories>(FilterCategories.text);
    const [filterList, setFilterList] = useState<string[]>([]);

    const updateOnChange = useCallback(() => {
        loadFromStorage<FilterStore>(filter!).then((store: FilterStore) => {
            setFilterList(store[filterCategory] || []);
        });
    }, []);

    useSticky(filter, updateOnChange);
    useSticky(filterCategory, updateOnChange);

    // Delete an entry from the filter
    const onDelete = useCallback(
        async (deletedFilter: string) => {
            const newFilters = filterList.filter((item) => item !== deletedFilter);
            setFilterList(newFilters);
            loadFromStorage<FilterStore>(filter!).then((store: FilterStore) => {
                const newStore = { ...store };
                newStore[filterCategory] = newFilters;
                saveToStorage(
                    filter === Stores.blackList ? Stores.blackList : Stores.whiteList,
                    newStore
                );
            });
        },
        [filter]
    );

    return (
        <>
            <JobTable style={{ width: '39rem', paddingBottom: '3rem', position: 'relative' }}>
                {filterList.map((item: string, index: number) => (
                    <FilterItem item={item} key={item + '-' + index} onDelete={onDelete} />
                ))}
                <FilterCategoryButton category={filterCategory} setCategory={setFilterCategory} />
            </JobTable>
            <div className="__jobler__filters_toggle-container">
                <Toggle
                    setValue={setFilter}
                    values={{ on: Stores.whiteList, off: Stores.blackList }}
                    defaultValue={Stores.blackList}
                    labels={{ on: 'Black List', off: 'White List' }}
                />
            </div>
        </>
    );
};
