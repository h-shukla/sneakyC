interface Category {
    _id: string;
    name: string;
    description: string;
}

interface CategoriesProps {
    categories: Category[];
}

const HomeCategories = (categoriesProp: CategoriesProps) => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="inline-block bg-yellow-400 px-6 py-3 rounded-r-full">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Browse By Categories
                    </h2>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="bg-gray-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {categoriesProp.categories.map(
                        (category) =>
                            category.name.toLowerCase() !== "men" &&
                            category.name.toLowerCase() !== "women" && (
                                <div
                                    key={category._id}
                                    className="flex flex-col items-center group cursor-pointer hover:transform hover:scale-105 transition-transform duration-200"
                                >
                                    {/* Icon Container */}
                                    <div className="mb-4 p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                        {category.name}
                                    </div>

                                    {/* Category Name */}
                                    <h3 className="text-lg font-semibold text-gray-800 text-center">
                                        {category.name}
                                    </h3>
                                </div>
                            )
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeCategories;
