import { Setter } from '@interfaces/react-state';
import { FilterCategories } from '@utils/stores';

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
        <div className="__jobler__filters-category-button_container" style={{ border: 'none' }}>
            <button
                className={`__jobler__filters-category-button_button text-filter ${textClass}`}
                onClick={onClick(FilterCategories.text)}
            >
                <span>Text</span>
            </button>
            <button
                className={`__jobler__filters-category-button_button title-filter ${titleClass}`}
                onClick={onClick(FilterCategories.title)}
            >
                Title
            </button>
            <button
                className={`__jobler__filters-category-button_button company-filter ${companyClass}`}
                onClick={onClick(FilterCategories.company)}
            >
                <span>Company</span>
            </button>
        </div>
    );
};
