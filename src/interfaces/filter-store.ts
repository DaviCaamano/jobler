export enum FilterCategories {
    text = 'text',
    title = 'title',
    company = 'company',
}

export interface FilterStore {
    text: string[];
    title: string[];
    company: string[];
}
