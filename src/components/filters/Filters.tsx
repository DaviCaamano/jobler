import '@components/filters/Filters.css';
import { useCallback, useEffect, useState } from 'react';
import { Toggle } from '@components/shared/toggle/Toggle';
import { FilterItem } from '@components/filters/FilterItem';
import { FilterCategoryButton } from '@components/filters/FilterCategoryButton';
import { AddFilterButton } from '@components/filters/AddFilterButton';
import { Stores } from '@interfaces/store';
import { FilterCategories } from '@interfaces/filter-store';
import { filterStorage } from '@stores/filter.store';
import { useFilterStorage } from '@hooks/useStorage';

type FilterType = Stores.blackList | Stores.whiteList;

export const Filters = () => {
    const [filter, setFilter] = useState<FilterType>(Stores.blackList);
    const [filterCategory, setFilterCategory] = useState<FilterCategories>(FilterCategories.text);
    const [filterList, setFilterList] = useState<string[]>([]);

    const loadFilters = useCallback(
        async () => setFilterList(await filterStorage.getList(filter, filterCategory)),
        [filter, filterCategory]
    );

    useEffect(() => {
        void loadFilters();
    }, [loadFilters]);

    // When either the filter or the filter category changes, reload the filters.
    useFilterStorage(filter, filterCategory, loadFilters);

    const onDelete = useCallback(
        async (deletedFilter: string) => {
            await filterStorage.remove(filter, filterCategory, deletedFilter);
            await loadFilters();
        },
        [filter, filterCategory, loadFilters]
    );

    const onAdd = useCallback(
        async (value: string) => {
            await filterStorage.add(filter, filterCategory, value);
            await loadFilters();
        },
        [filter, filterCategory, loadFilters]
    );

    return (
        <div className="filters_container">
            <div className="filters_job-list-container">
                <div className="filters_job-table">
                    {filterList.map((item: string, index: number) => (
                        <FilterItem item={item} key={item + '-' + index} onDelete={onDelete} />
                    ))}
                </div>
            </div>

            <AddFilterButton
                onSubmit={onAdd}
                placeholder={`New ${filterCategory} ${filter === Stores.blackList ? 'blacklist' : 'whitelist'} item`}
            />

            <div className="filters_toggle-container">
                <FilterCategoryButton category={filterCategory} setCategory={setFilterCategory} />
                <Toggle
                    setValue={setFilter}
                    values={{ on: Stores.whiteList, off: Stores.blackList }}
                    defaultValue={Stores.blackList}
                    labels={{ on: 'White List', off: 'Black List' }}
                    widthRem={6}
                    heightRem={2.25}
                />
            </div>
        </div>
    );
};
