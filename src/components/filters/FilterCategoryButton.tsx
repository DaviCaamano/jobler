import { Setter } from '@interfaces/react-state';
import { FilterCategories } from '@stores/filter-store';

interface FilterCategoryButtonProps {
    category: FilterCategories;
    setCategory: Setter<FilterCategories>;
}
export const FilterCategoryButton = ({ category, setCategory }: FilterCategoryButtonProps) => {
    const textClass = category === FilterCategories.text ? 'on' : 'off';
    const titleClass = category === FilterCategories.title ? 'on' : 'off';
    const companyClass = category === FilterCategories.company ? 'on' : 'off';

    const onClick = (selectedCategory: FilterCategories) => () => {
        setCategory(selectedCategory);
    };
    return (
        <div className="filters-category-button_container" style={{ border: 'none' }}>
            <button
                className={`filters-category-button_button button-lighting text-filter ${textClass}`}
                onClick={onClick(FilterCategories.text)}
            >
                <span>Text</span>
            </button>
            <button
                className={`filters-category-button_button button-lighting title-filter ${titleClass}`}
                onClick={onClick(FilterCategories.title)}
            >
                Title
            </button>
            <button
                className={`filters-category-button_button button-lighting company-filter ${companyClass}`}
                onClick={onClick(FilterCategories.company)}
            >
                <span>Company</span>
            </button>
        </div>
    );
};
