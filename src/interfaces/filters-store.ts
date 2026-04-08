export enum FiltersStrategy {
    blackList = 'blackList',
    whiteList = 'whiteList',
}

export enum FilterCategories {
    text = 'text',
    title = 'title',
    company = 'company',
}
export type FilterEntry = string | RegExp;
export type FiltersCategoryStore = Record<FilterCategories, FilterEntry[]>;
export type FiltersStore = Record<FiltersStrategy, FiltersCategoryStore>;
export type PartialFiltersStore = {
    [FiltersStrategy.blackList]?: Partial<FiltersCategoryStore>;
    [FiltersStrategy.whiteList]?: Partial<FiltersCategoryStore>;
};
