import axios from "axios";
import React, { useEffect, useState } from "react";
import type { ProductInterface as Product } from "../interface/ProductInterface";
import { Link } from "react-router";

interface ProductsListingProps {
    productsProp?: Product[];
}

const ProductsListing: React.FC<ProductsListingProps> = ({ productsProp }) => {
    const [products, setProducts] = useState<Product[]>(productsProp || []);
    const [showFilters, setShowFilters] = useState(false);

    const [sortOption, setSortOption] = useState<string>("");
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(100000); // default slider max
    const [minRating, setMinRating] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 16;

    // For debouncing slider updates
    const [sliderMin, setSliderMin] = useState<number>(0);
    const [sliderMax, setSliderMax] = useState<number>(100000);

    useEffect(() => {
        if (products.length === 0) {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/products`
                    );
                    setProducts(response.data.products);
                    console.log(response.data.products);
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            };
            fetchProducts();
        }
    }, [products.length]);

    // Debounce slider updates (apply filters after short delay)
    useEffect(() => {
        const handler = setTimeout(() => {
            setMinPrice(sliderMin);
            setMaxPrice(sliderMax);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(handler);
    }, [sliderMin, sliderMax]);

    // Filtered and sorted products
    const filteredProducts = products
        .filter(
            (product) =>
                product.price >= minPrice &&
                product.price <= maxPrice &&
                product.ratings >= minRating
        )
        .sort((a, b) => {
            switch (sortOption) {
                case "priceAsc":
                    return a.price - b.price;
                case "priceDesc":
                    return b.price - a.price;
                case "rating":
                    return b.ratings - a.ratings;
                case "newest":
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                default:
                    return 0;
            }
        });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const FiltersContent = () => (
        <div className="space-y-6">
            {/* Sort By */}
            <div>
                <label className="block font-medium mb-1">Sort By</label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={sortOption}
                    onChange={(e) => {
                        setSortOption(e.target.value);
                        setCurrentPage(1);
                        setShowFilters(false);
                    }}
                >
                    <option value="">Relevance</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Rating</option>
                </select>
            </div>

            {/* Price Range Slider */}
            <div>
                <label className="block font-medium mb-1">Price Range</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        step={10}
                        value={sliderMin}
                        onChange={(e) => setSliderMin(Number(e.target.value))}
                        className="w-full"
                    />
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        step={10}
                        value={sliderMax}
                        onChange={(e) => setSliderMax(Number(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div className="flex justify-between text-sm mt-2">
                    <span>Min: ${sliderMin}</span>
                    <span>Max: ${sliderMax}</span>
                </div>
            </div>

            {/* Minimum Rating */}
            <div>
                <label className="block font-medium mb-1">Minimum Rating</label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={minRating}
                    onChange={(e) => {
                        setMinRating(Number(e.target.value));
                        setCurrentPage(1);
                        setShowFilters(false);
                    }}
                >
                    <option value={0}>All</option>
                    <option value={1}>1 star & up</option>
                    <option value={2}>2 stars & up</option>
                    <option value={3}>3 stars & up</option>
                    <option value={4}>4 stars & up</option>
                </select>
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">All Products</h1>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                            />
                        </svg>
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            {/* Mobile Filters Overlay */}
            {showFilters && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50">
                    <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Filters</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <FiltersContent />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex px-4 md:px-8 py-6 md:py-12">
                {/* Desktop Filters Sidebar */}
                <aside className="hidden md:block w-64 pr-8 border-r border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Filters</h2>
                    <FiltersContent />
                </aside>

                {/* Products Grid */}
                <main className="flex-1 md:pl-8">
                    <h1 className="hidden md:block text-2xl font-bold mb-6">
                        All Products
                    </h1>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                No products match your filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                            {currentProducts.map((product) => (
                                <Link
                                    to={`/product/${product._id}`}
                                    key={product._id}
                                >
                                    <div className="bg-gray-50 p-2 md:p-4 rounded shadow-sm hover:shadow-md transition">
                                        <div className="relative h-32 md:h-48 flex items-center justify-center bg-white mb-2 md:mb-4 overflow-hidden rounded">
                                            {product.discount && (
                                                <span className="absolute top-1 md:top-2 left-1 md:left-2 bg-red-500 text-white text-xs px-1 md:px-2 py-1 rounded">
                                                    -{product.discount}%
                                                </span>
                                            )}
                                            <img
                                                src={
                                                    product.imagePublicId[0]
                                                        ? `${
                                                              import.meta.env
                                                                  .VITE_API_BASE_URL
                                                          }/${product.imagePublicId[0].replace(
                                                              /\\/g,
                                                              "/"
                                                          )}`
                                                        : "https://via.placeholder.com/150"
                                                }
                                                alt={product.name}
                                                className="h-24 md:h-32 object-contain"
                                            />
                                        </div>
                                        <h3 className="text-xs md:text-sm font-medium mb-1 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="text-red-600 font-semibold text-sm md:text-base">
                                            ${product.price}
                                        </div>
                                        {product.discount && (
                                            <div className="text-gray-400 line-through text-xs md:text-sm">
                                                $
                                                {(
                                                    product.price /
                                                    (1 - product.discount / 100)
                                                ).toFixed(2)}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500 mt-1">
                                            ⭐ {product.ratings.toFixed(1)} (
                                            {product.numberOfReviews})
                                        </div>
                                        <button className="mt-2 md:mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition text-xs md:text-sm">
                                            Add to Cart
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap justify-center mt-6 md:mt-10 gap-2">
                            {currentPage > 1 && (
                                <button
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                    className="md:hidden px-3 py-2 border rounded bg-white text-black hover:bg-gray-100"
                                >
                                    ←
                                </button>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => {
                                const pageNum = i + 1;
                                const showOnMobile =
                                    pageNum === 1 ||
                                    pageNum === totalPages ||
                                    Math.abs(pageNum - currentPage) <= 1;

                                if (window.innerWidth < 768 && !showOnMobile) {
                                    return null;
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 md:px-4 py-2 border rounded text-sm ${
                                            currentPage === pageNum
                                                ? "bg-black text-white"
                                                : "bg-white text-black hover:bg-gray-100"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            {currentPage < totalPages && (
                                <button
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                    className="md:hidden px-3 py-2 border rounded bg-white text-black hover:bg-gray-100"
                                >
                                    →
                                </button>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsListing;
