import '@components/filters/Filters.css';
import { useCallback, useState } from 'react';
import { Toggle } from '@components/shared/toggle/Toggle';
import { FilterItem } from '@components/filters/FilterItem';
import { FilterCategoryButton } from '@components/filters/FilterCategoryButton';
import { AddFilterButton } from '@components/filters/AddFilterButton';
import { Stores } from '@interfaces/store';
import { FilterCategories } from '@interfaces/filter-store';
import { filterStorage } from '@stores/filter.store';
import { useFilterStorage, useSettingStorage } from '@hooks/useStorage';
import { FilterSettings, Settings, SettingsOptions } from '@interfaces/settings';
import { storage } from '@stores/storage';

type FilterType = Stores.blackList | Stores.whiteList;

interface FiltersProps {
    show: boolean;
}
export const Filters = ({ show }: FiltersProps) => {
    const [filter, setFilter] = useState<FilterType>(Stores.blackList);
    const [filterCategory, setFilterCategory] = useState<FilterCategories>(FilterCategories.text);
    const [filterList, setFilterList] = useState<string[]>([]);

    const loadFilters = useCallback(async () => {
        const newFilterList = await filterStorage.get(filter, filterCategory);
        setFilterList(newFilterList);
    }, [filter, filterCategory]);

    // When either the filter or the filter category changes, reload the filters.
    useFilterStorage(filter, filterCategory, loadFilters);

    useSettingStorage(SettingsOptions.filters, async (changes: Partial<Settings>) => {
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

    const onFilterChange = (newFilter: FilterType) => {
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
        void storage.patch(Stores.settings, (currentValue: Settings) => {
            return {
                ...currentValue,
                [SettingsOptions.filters]: {
                    [FilterSettings.filterList]:
                        currentValue[SettingsOptions.filters][FilterSettings.filterList],
                    [FilterSettings.filterCategory]: newCategory,
                },
            };
        });
    };

    return (
        <div className="filters_container" style={{ display: show ? 'flex' : 'none' }}>
            <AddFilterButton
                onSubmit={onAdd}
                placeholder={`New ${filterCategory} ${filter === Stores.blackList ? 'blacklist' : 'whitelist'} item`}
            />

            <div className="filters_job-list-container">
                <div className="filters_job-table">
                    {filterList.map((item: string, index: number) => (
                        <FilterItem item={item} key={item + '-' + index} onDelete={onDelete} />
                    ))}
                </div>
            </div>

            <div className="filters_toggle-container">
                <FilterCategoryButton
                    category={filterCategory}
                    setCategory={onFilterCategoryChange}
                />
                <Toggle<{ on: FilterType; off: FilterType }>
                    setValue={onFilterChange}
                    value={filter}
                    values={{ on: Stores.whiteList, off: Stores.blackList }}
                    labels={{ on: 'White List', off: 'Black List' }}
                    widthRem={6}
                    heightRem={2.25}
                    textStyle={{ color: '#ffffff' }}
                />
            </div>
        </div>
    );
};
