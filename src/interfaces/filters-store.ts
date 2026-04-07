export enum FiltersStrategy {
    blackList = 'blackList',
    whiteList = 'whiteList',
}

export enum FilterCategories {
    text = 'text',
    title = 'title',
    company = 'company',
}

export type FiltersCategoryStore = Record<FilterCategories, string[]>;
export type FiltersStore = Record<FiltersStrategy, FiltersCategoryStore>;
