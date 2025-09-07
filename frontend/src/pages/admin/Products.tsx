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
    category: string;
    images: File[];
}

// Props for the ProductCard component
interface ProductCardProps {
    logo: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    _id: string;
    onEdit: () => void;
    onDelete: () => void;
}

// ProductCard Component
const ProductCard: React.FC<ProductCardProps> = ({
    logo,
    title,
    description,
    price,
    stock,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:border-green-400/30">
            <div className="h-44 bg-white flex items-center justify-center">
                <img
                    src={import.meta.env.VITE_API_BASE_URL + "/" + logo}
                    alt={title}
                    className="h-24 object-contain"
                />
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
                        className="flex-1 px-3 py-2 bg-white/10 text-white text-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all flex items-center justify-center gap-1"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-1"
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
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // State for managing the modal
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState<string | null>(null);

    // State for the product form data
    const [newProduct, setNewProduct] = useState<NewProductData>({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        images: [],
    });

    // Fetch products from API
    const getProducts = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/products`
            );
            setProducts(res.data.products);
        } catch (err) {
            setError(`Failed to fetch products. ${getErrorMessage(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch categories from API
    const getCategories = async () => {
        setError(""); // Clear error specific to category fetch
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/category`
            );
            setCategories(res.data.categories);
        } catch (err) {
            setError(`Failed to fetch categories. ${getErrorMessage(err)}`);
        }
    };

    // Handle input changes for form fields
    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file input changes for images
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setNewProduct((prev) => ({ ...prev, images: Array.from(files) }));
        }
    };

    // Reset the form state
    const resetForm = () => {
        setNewProduct({
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            images: [],
        });
        setError("");
        setEditProductId(null);
        setIsEditMode(false);
    };

    // Validate the form before submission
    const validateForm = (): boolean => {
        const { name, description, price, stock, category, images } =
            newProduct;
        if (
            !name ||
            !description ||
            !price ||
            !stock ||
            !category ||
            (!images.length && !isEditMode) // Images are optional in edit mode if no new ones are added
        ) {
            setError(
                "Please fill in all required fields. Ensure a category is selected and images are provided for new products."
            );
            return false;
        }
        // Additional validation for numbers if necessary
        if (isNaN(Number(price)) || Number(price) < 0) {
            setError("Price must be a non-negative number.");
            return false;
        }
        if (isNaN(Number(stock)) || Number(stock) < 0) {
            setError("Stock must be a non-negative integer.");
            return false;
        }
        return true;
    };

    // Create FormData for API requests
    const createFormData = (productData: NewProductData): FormData => {
        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
            if (key === "images") {
                (value as File[]).forEach((img) =>
                    formData.append("images", img)
                );
            } else {
                formData.append(key, value as string);
            }
        });
        return formData;
    };

    // Helper to extract meaningful error messages from Axios errors
    const getErrorMessage = (err: unknown): string => {
        if (axios.isAxiosError(err)) {
            // Try to get specific message from response data
            const message =
                err.response?.data?.message || err.response?.data?.error;
            if (typeof message === "string") {
                return message;
            }
            // Fallback to generic error message
            return err.message || "An API error occurred.";
        }
        if (err instanceof Error) {
            return err.message;
        }
        return "An unexpected error occurred.";
    };

    // Handle adding a new product
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError("");

        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/admin/products/new`,
                createFormData(newProduct),
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            await getProducts(); // Refresh the product list
            setShowModal(false); // Close the modal
            resetForm(); // Reset form fields
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle updating an existing product
    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !editProductId) return; // Ensure we have an ID to update

        setIsLoading(true);
        setError("");

        try {
            await axios.put(
                `${
                    import.meta.env.VITE_API_BASE_URL
                }/admin/products/${editProductId}`,
                createFormData(newProduct),
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            await getProducts(); // Refresh the product list
            setShowModal(false); // Close the modal
            resetForm(); // Reset form fields
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle deleting a product
    const handleDeleteProduct = async (productId: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            await axios.delete(
                `${
                    import.meta.env.VITE_API_BASE_URL
                }/admin/products/${productId}`,
                { withCredentials: true }
            );
            await getProducts(); // Refresh the product list
            // If the deleted product was the one in edit mode, close modal
            if (editProductId === productId) {
                setShowModal(false);
                resetForm();
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to fetch initial data when the component mounts
    useEffect(() => {
        getProducts();
        getCategories();
        // eslint-disable-next-line
    }, []);

    const filteredProducts = products.filter((p) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return (
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) // Assuming category is a string ID
        );
    });

    const totalProducts = products.length;

    return (
        <div className="min-h-screen overflow-x-hidden">
            <main className="p-8 bg-white/5">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
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
                            <button className="px-6 py-3 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-xl font-semibold hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                                📊 Export
                            </button>
                            <button
                                onClick={() => {
                                    resetForm(); // Reset form for new product
                                    setShowModal(true); // Open modal
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-green-400/40 flex items-center gap-2"
                            >
                                ➕ Add Product
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 mb-8">
                    <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg">
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

                    <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg">
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

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
                    <div className="flex gap-4 items-center flex-wrap">
                        <div className="flex-1 min-w-64 relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 text-xl">
                                🔍
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                                placeholder="Search products by name, description, or category..."
                            />
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Loading Spinner or Message */}
                {isLoading && (
                    <div className="text-center py-10">Loading...</div>
                )}

                {/* Products Grid */}
                {!isLoading && filteredProducts.length === 0 && !error && (
                    <div className="text-center py-10">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-white/70 text-lg">
                            No products found matching your criteria.
                        </p>
                    </div>
                )}

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id!}
                            logo={product.image?.[0] || ""}
                            title={product.name}
                            description={product.description}
                            price={Number(product.price)}
                            stock={Number(product.stock)}
                            _id={product._id!}
                            onEdit={() => {
                                // Populate form with product data for editing
                                setNewProduct({
                                    name: product.name,
                                    description: product.description,
                                    price: String(product.price),
                                    stock: String(product.stock),
                                    category: product.category || "", // Ensure category is set correctly
                                    images: [], // Clear existing images for re-upload
                                });
                                setIsEditMode(true); // Set to edit mode
                                setEditProductId(product._id!); // Set the ID of product being edited
                                setShowModal(true); // Open the modal
                            }}
                            onDelete={() => {
                                handleDeleteProduct(product._id!);
                            }}
                        />
                    ))}
                </div>

                {/* Product Modal (Add/Edit) */}
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
                                            value={newProduct.category}
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

                                {/* File Upload */}
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Product Images{" "}
                                        {isEditMode ? "(optional)" : "*"}
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

                                {/* Action Buttons */}
                                <div className="flex gap-4 justify-end mt-8">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false); // Close modal
                                            resetForm(); // Reset form on cancel
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
