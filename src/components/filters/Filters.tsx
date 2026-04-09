import '@components/filters/Filters.css';
import { useCallback, useRef, useState } from 'react';
import { Toggle } from '@components/shared/toggle/Toggle';
import { FilterItem } from '@components/filters/FilterItem';
import { FilterCategoryButton } from '@components/filters/FilterCategoryButton';
import { AddFilterButton } from '@components/filters/AddFilterButton';
import { Stores } from '@interfaces/store';
import { FilterCategories, FilterEntry, FiltersStrategy } from '@interfaces/filters-store';
import { filterStorage } from '@stores/filter.store';
import { useFilterStorage, useSettingStorage } from '@hooks/useStorage';
import { FilterSettings, Settings, SettingsOptions } from '@interfaces/settings';
import { storage } from '@stores/storage';
import { useSticky } from '@hooks/useSticky';

interface FiltersProps {
    show: boolean;
}
export const Filters = ({ show }: FiltersProps) => {
    const [filter, setFilter] = useState<FiltersStrategy>(FiltersStrategy.blackList);
    const [filterCategory, setFilterCategory] = useState<FilterCategories>(FilterCategories.text);
    const [filterList, setFilterList] = useState<FilterEntry[]>([]);
    const tableRef = useRef<HTMLDivElement>(null);

    // Every time a new filter is added to the list, scroll the list to the bottom
    useSticky(filterList.length, (previousFilterLength) => {
        console.log('previousFilterLength', previousFilterLength);
        console.log('test', previousFilterLength, filterList.length);
        if (
            typeof previousFilterLength !== 'undefined' &&
            previousFilterLength < filterList.length
        ) {
            tableRef.current?.scrollTo({
                behavior: 'smooth',
                top: (tableRef.current?.scrollHeight ?? 0) - 30,
            });
        }
    });

    const loadFilters = useCallback(async () => {
        const result: unknown = await filterStorage.get(filter, filterCategory);
        setFilterList(Array.isArray(result) ? (result as FilterEntry[]) : []);
    }, [filter, filterCategory]);

    // When either the filter or the filter category changes, reload the filters.
    useFilterStorage(filter, filterCategory, loadFilters);

    useSettingStorage(SettingsOptions.filters, (changes: Partial<Settings>) => {
        const changedFilterList = changes?.[SettingsOptions.filters]?.[FilterSettings.filterList];
        const changedCategory = changes?.[SettingsOptions.filters]?.[FilterSettings.filterCategory];

        // list changed
        if (changedFilterList) {
            setFilter(changedFilterList);
        }

        // category changed
        if (changedCategory) {
            setFilterCategory(changedCategory);
        }
    });

    const onDelete = useCallback(
        (deletedFilter: FilterEntry) => {
            filterStorage
                .remove(filter, filterCategory, deletedFilter)
                .then(loadFilters)
                .catch(loadFilters);
        },
        [filter, filterCategory, loadFilters]
    );

    const onAdd = useCallback(
        (value: string) => {
            filterStorage.add(filter, filterCategory, value).then(loadFilters).catch(loadFilters);
        },
        [filter, filterCategory, loadFilters]
    );

    const onFilterChange = (newFilter: FiltersStrategy) => {
        void storage.patch(Stores.settings, (currentValue: Settings) => {
            return {
                ...currentValue,
                [SettingsOptions.filters]: {
                    [FilterSettings.filterList]: newFilter,
                    [FilterSettings.filterCategory]:
                        currentValue[SettingsOptions.filters][FilterSettings.filterCategory],
                },
            };
        });
    };

    const onFilterCategoryChange = (newCategory: FilterCategories) => {
        void storage
            .patch(Stores.settings, (currentValue: Settings) => {
                return {
                    ...currentValue,
                    [SettingsOptions.filters]: {
                        [FilterSettings.filterList]:
                            currentValue[SettingsOptions.filters][FilterSettings.filterList],
                        [FilterSettings.filterCategory]: newCategory,
                    },
                };
            })
            .then();
    };

    return (
        <div className="filters_container" style={{ display: show ? 'flex' : 'none' }}>
            <AddFilterButton
                onSubmit={onAdd}
                placeholder={`New ${filterCategory} ${filter === FiltersStrategy.blackList ? 'blacklist' : 'whitelist'} item`}
            />

            <div className="filters_job-list-container">
                <div className="filters_job-table" ref={tableRef}>
                    {filterList.map((item, index) => (
                        <FilterItem item={item} key={item + '-' + index} onDelete={onDelete} />
                    ))}
                </div>
            </div>

            <div className="filters_toggle-container">
                <FilterCategoryButton
                    category={filterCategory}
                    setCategory={onFilterCategoryChange}
                />
                <Toggle
                    setValue={onFilterChange}
                    value={filter}
                    values={{ on: FiltersStrategy.whiteList, off: FiltersStrategy.blackList }}
                    labels={{ on: 'White List', off: 'Black List' }}
                    widthRem={6}
                    heightRem={2.25}
                    textStyle={{ color: '#ffffff' }}
                />
            </div>
        </div>
    );
};
