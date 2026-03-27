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
import { AddFilterButton } from '@components/filters/AddFilterButton';

const exampleDefaults = [
    'underdog.io',
    'Crossing Hurdles',
    'HelixRecruit',
    'Base44',
    'Affinitiv',
    'hypergiant',
    'Roblox',
    'bitpay',
    'imentor',
    'servicecore',
    'service core',
    'Trapp Technology',
    'Trust & Will',
];
type FilterType = Stores.blackList | Stores.whiteList;

export const Filters = () => {
    const [filter, setFilter] = useState<FilterType>(Stores.whiteList);
    const [filterCategory, setFilterCategory] = useState<FilterCategories>(FilterCategories.text);
    const [filterList, setFilterList] = useState<string[]>(exampleDefaults);

    const updateOnChange = useCallback(() => {
        loadFromStorage<FilterStore>(filter!).then((store: FilterStore) => {
            // TODO REPLACE exampleDefaults with "store[filterCategory] || exampleDefaults"
            setFilterList(exampleDefaults);
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
        <div className="filters_container">
            <div className={'filters_job-list-container'}>
                <div className={'filters_job-table'}>
                    {filterList.map((item: string, index: number) => (
                        <FilterItem item={item} key={item + '-' + index} onDelete={onDelete} />
                    ))}
                </div>
            </div>
            <AddFilterButton />
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
