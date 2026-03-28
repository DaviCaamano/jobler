import { FilterCategories } from '@interfaces/filter-store';

interface FilterCategoryButtonProps {
    category: FilterCategories;
    setCategory: (selectedCategory: FilterCategories) => void;
}
export const FilterCategoryButton = ({ category, setCategory }: FilterCategoryButtonProps) => {
    const textClass = category === FilterCategories.text ? 'on' : 'off';
    const titleClass = category === FilterCategories.title ? 'on' : 'off';
    const companyClass = category === FilterCategories.company ? 'on' : 'off';

    return (
        <div className="filters-category-button_container" style={{ border: 'none' }}>
            <button
                className={`filters-category-button_button button-lighting text-filter ${textClass}`}
                onClick={() => setCategory(FilterCategories.text)}
            >
                <span>Text</span>
            </button>
            <button
                className={`filters-category-button_button button-lighting title-filter ${titleClass}`}
                onClick={() => setCategory(FilterCategories.title)}
            >
                Title
            </button>
            <button
                className={`filters-category-button_button button-lighting company-filter ${companyClass}`}
                onClick={() => setCategory(FilterCategories.company)}
            >
                <span>Company</span>
            </button>
        </div>
    );
};
