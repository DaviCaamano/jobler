export const FilterCategoryButton = () => {
    return (
        <div className="__jobler__filters-category-button_container" style={{ border: 'none' }}>
            <button className="__jobler__filters-category-button_button text-filter">
                <span>Text</span>
            </button>
            <button className="__jobler__filters-category-button_button title-filter">Title</button>
            <button className="__jobler__filters-category-button_button company-filter">
                <span>Company</span>
            </button>
        </div>
    );
};
