import React, { useEffect, useState } from "react";
import axios from "axios";
import type { ProductInterface } from "../../interface/ProductInterface";
import type { Category } from "../../interface/CategoryInterface";

// Interface for the data used in the form/modal
interface NewProductData {
    name: string;
    description: string;
    price: string;
    stock: string;
    category: Category;
    subCategory: Category;
    images: File[];
}

// Props for the ProductCard component
interface ProductCardProps {
    images: string[];
    title: string;
    description: string;
    price: number;
    stock: number;
    _id: string;
    onEdit: () => void;
    onDelete: () => void;
}

// ProductCard Component with Image Carousel
const ProductCard: React.FC<ProductCardProps> = ({
    images,
    title,
    description,
    price,
    stock,
    onEdit,
    onDelete,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [images]);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:border-green-400/30">
            <div className="h-56 bg-white flex items-center justify-center relative group">
                {images.length > 0 ? (
                    <>
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/${
                                images[currentImageIndex]
                            }`}
                            alt={`${title} - Image ${currentImageIndex + 1}`}
                            className="h-40 w-auto object-contain transition-opacity duration-300"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                                    aria-label="Previous image"
                                >
                                    ◀
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                                    aria-label="Next image"
                                >
                                    ▶
                                </button>
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImageIndex(index);
                                            }}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                index === currentImageIndex
                                                    ? "bg-white"
                                                    : "bg-white/50 hover:bg-white/70"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="text-gray-400 text-6xl">📷</div>
                )}
            </div>
            <div className="p-6">
                <h4 className="text-white text-lg font-semibold mb-2">
                    {title}
                </h4>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                    {description}
                </p>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-yellow-400 text-xl font-bold">
                        ₹{price}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                        {stock} in stock
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="flex-1 px-3 py-2 bg-white/10 text-white text-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-lg hover:-translate-y-1 transition-all"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Products Page Component
const Products: React.FC = () => {
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState<string | null>(null);

    const [newProduct, setNewProduct] = useState<NewProductData>({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: { _id: "", name: "", description: "" },
        subCategory: { _id: "", name: "", description: "" },
        images: [],
    });

    const getProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/products`
            );
            setProducts(res.data.products);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategories = async () => {
        const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/category`
        );
        const categories: Category[] = res.data.categories;
        const subCategories = categories.filter(
            (cat: Category) => cat.name !== "Men" && cat.name !== "Women"
        );
        setSubCategories(subCategories);

        const cat = categories.filter(
            (cat: Category) => cat.name === "Men" || cat.name === "Women"
        );
        setCategories(cat);
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        if (name === "category") {
            const selectedCategory = categories.find(
                (cat) => cat._id === value
            );
            setNewProduct((prev) => ({
                ...prev,
                category: selectedCategory || {
                    _id: "",
                    name: "",
                    description: "",
                },
            }));
        } else if (name === "subCategory") {
            const selectedSubCategory = subCategories.find(
                (cat) => cat._id === value
            );
            setNewProduct((prev) => ({
                ...prev,
                subCategory: selectedSubCategory || {
                    _id: "",
                    name: "",
                    description: "",
                },
            }));
        } else {
            setNewProduct((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setNewProduct((prev) => ({ ...prev, images: Array.from(files) }));
        }
    };

    const resetForm = () => {
        setNewProduct({
            name: "",
            description: "",
            price: "",
            stock: "",
            category: { _id: "", name: "", description: "" },
            subCategory: { _id: "", name: "", description: "" },
            images: [],
        });
        setEditProductId(null);
        setIsEditMode(false);
    };

    const createFormData = (productData: NewProductData): FormData => {
        const formData = new FormData();
        const transformedData = {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            stock: productData.stock,
            category: productData.category._id,
            subCategory: productData.subCategory._id,
        };
        Object.entries(transformedData).forEach(([key, value]) => {
            if (value) formData.append(key, value as string);
        });
        productData.images.forEach((img) => {
            formData.append("images", img);
        });
        return formData;
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = createFormData(newProduct);
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/admin/products/new`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            await getProducts();
            setShowModal(false);
            resetForm();
        } catch (err) {
            setError(true);
            setErrorMessage(
                `Failed to add product. ${
                    err instanceof Error ? err.message : "Unknown error"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editProductId) return;
        setIsLoading(true);
        try {
            const formData = createFormData(newProduct);
            await axios.put(
                `${
                    import.meta.env.VITE_API_BASE_URL
                }/admin/products/${editProductId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            await getProducts();
            setShowModal(false);
            resetForm();
        } catch (err) {
            setError(true);
            setErrorMessage(
                `Failed to update product. ${
                    err instanceof Error ? err.message : "Unknown error"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!window.confirm("Are you sure you want to delete this product?"))
            return;
        setIsLoading(true);
        try {
            await axios.delete(
                `${
                    import.meta.env.VITE_API_BASE_URL
                }/admin/products/${productId}`,
                {
                    withCredentials: true,
                }
            );
            await getProducts();
            if (editProductId === productId) {
                setShowModal(false);
                resetForm();
            }
        } catch (err) {
            setError(true);
            setErrorMessage(
                `Failed to delete product. ${
                    err instanceof Error ? err.message : "Unknown error"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
        getCategories();
    }, []);

    const filteredProducts = products.filter((p) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return (
            p.name.toLowerCase().includes(q) ||
            p.category.name.toLowerCase().includes(q) ||
            p.subCategory.name.toLowerCase().includes(q)
        );
    });

    const totalProducts = products.length;

    return (
        <div className="min-h-screen overflow-x-hidden">
            <main className="p-8 bg-white/5">
                {/* Header */}
                <div className="bg-white/10 rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h2 className="text-white text-3xl font-semibold mb-2">
                                Product Management
                            </h2>
                            <p className="text-white/70 text-lg">
                                Manage your store's inventory and product
                                details
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl">
                                📊 Export
                            </button>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowModal(true);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl"
                            >
                                ➕ Add Product
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mb-8">
                    <div className="flex-1 bg-white/10 rounded-3xl p-6 border border-white/20 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm font-medium uppercase tracking-wide">
                                    Total Products
                                </p>
                                <p className="text-white text-3xl font-bold">
                                    {totalProducts}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                                📦
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-white/10 rounded-3xl p-6 border border-white/20 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm font-medium uppercase tracking-wide">
                                    Search
                                </p>
                                <p className="text-white text-lg font-medium">
                                    Filter list by name/description
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">
                                🔎
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white/10 rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
                    <div className="flex gap-4 items-center flex-wrap">
                        <div className="flex-1 min-w-64 relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 text-xl">
                                🔍
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white"
                                placeholder="Search products..."
                            />
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="text-center py-10">Loading...</div>
                )}

                {/* No Products */}
                {!isLoading && filteredProducts.length === 0 && (
                    <div className="text-center py-10">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-white/70 text-lg">
                            No products found.
                        </p>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id!}
                            images={product.imagePublicId || []}
                            title={product.name}
                            description={product.description}
                            price={Number(product.price)}
                            stock={Number(product.stock)}
                            _id={product._id!}
                            onEdit={() => {
                                setNewProduct({
                                    name: product.name,
                                    description: product.description,
                                    price: String(product.price),
                                    stock: String(product.stock),
                                    category: product.category || {
                                        _id: "",
                                        name: "",
                                        description: "",
                                    },
                                    subCategory: product.subCategory || {
                                        _id: "",
                                        name: "",
                                        description: "",
                                    },
                                    images: [],
                                });
                                setIsEditMode(true);
                                setEditProductId(product._id!);
                                setShowModal(true);
                            }}
                            onDelete={() => handleDeleteProduct(product._id!)}
                        />
                    ))}
                </div>

                {/* Product Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 p-4">
                        <div className="bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 w-full max-w-xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6 text-white">
                                {isEditMode
                                    ? "Edit Product"
                                    : "Add New Product"}
                            </h2>
                            <form
                                onSubmit={
                                    isEditMode
                                        ? handleUpdateProduct
                                        : handleAddProduct
                                }
                                className="space-y-6"
                            >
                                {/* Name */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newProduct.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-red-400/50"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                                {/* Description */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newProduct.description}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-white resize-none min-h-24 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                                        placeholder="Enter product description"
                                        required
                                    />
                                </div>
                                {/* Price */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newProduct.price}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-red-400/50"
                                        placeholder="Enter price"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                {/* Stock */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={newProduct.stock}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-red-400/50"
                                        placeholder="Enter available stock"
                                        min="0"
                                        required
                                    />
                                </div>
                                {/* Category */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Category *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={newProduct.category._id}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-white/20 rounded-xl bg-[#0e0913] backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-red-400/50 appearance-none"
                                            style={{
                                                colorScheme: "dark",
                                            }}
                                        >
                                            <option
                                                value=""
                                                className="bg-[#0e0913] text-white"
                                            >
                                                Select category
                                            </option>
                                            {categories.map((cat) => (
                                                <option
                                                    key={cat._id}
                                                    value={cat._id}
                                                    className="bg-[#0e0913] text-white hover:bg-gray-800"
                                                >
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {/* Custom arrow for select */}
                                        <svg
                                            className="w-4 h-4 absolute right-3 top-1/2 -mt-2 text-white/60 pointer-events-none"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>
                                {/* Sub Category */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Sub Category *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="subCategory"
                                            value={newProduct.subCategory._id}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-white/20 rounded-xl bg-[#0e0913] backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-red-400/50 appearance-none"
                                            style={{
                                                colorScheme: "dark",
                                            }}
                                            required
                                        >
                                            <option
                                                value=""
                                                className="bg-[#0e0913] text-white"
                                            >
                                                Select sub category
                                            </option>
                                            {subCategories.map((cat) => (
                                                <option
                                                    key={cat._id}
                                                    value={cat._id}
                                                    className="bg-[#0e0913] text-white hover:bg-gray-800"
                                                >
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {/* Custom arrow for select */}
                                        <svg
                                            className="w-4 h-4 absolute right-3 top-1/2 -mt-2 text-white/60 pointer-events-none"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>
                                {/* File Upload */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Product Images{" "}
                                        {isEditMode ? "(optional)" : "*"}
                                        (Selection of multiple images is
                                        supported)
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-white/15 file:text-white file:cursor-pointer hover:file:bg-white/20 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                                        required={!isEditMode} // Only required if not in edit mode
                                    />
                                </div>
                                {error ? (
                                    <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-4">
                                        {errorMessage}
                                    </div>
                                ) : (
                                    ""
                                )}
                                {/* Action Buttons */}
                                <div className="flex gap-4 justify-end mt-8">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false); // Close modal
                                            resetForm(); // Reset form on cancel
                                            setError(false);
                                            setErrorMessage("");
                                        }}
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/15 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:-translate-y-1 transition-all shadow-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                                    >
                                        {isLoading
                                            ? "Saving..."
                                            : "Save Product"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Products;
