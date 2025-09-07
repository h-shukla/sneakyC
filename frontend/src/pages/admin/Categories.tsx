import axios from "axios";
import React, { useEffect, useState } from "react";
import type { Category } from "../../interface/CategoryInterface";

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [descInput, setDescInput] = useState("");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Consistent base URL

    const getCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/category`);
            if (res.status === 200) {
                // Ensure res.data is an array and contains _id
                if (Array.isArray(res.data)) {
                    setCategories(res.data);
                } else if (res.data && Array.isArray(res.data.categories)) {
                    // Adjust if your API nests categories, e.g., { categories: [...] }
                    setCategories(res.data.categories);
                } else {
                    console.error(
                        "API did not return an array of categories:",
                        res.data
                    );
                    setCategories([]);
                }
            } else {
                console.error(
                    "Failed to fetch categories. Status:",
                    res.status
                );
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    };

    useEffect(() => {
        getCategories();
    }, []); // eslint-disable-line

    const filteredCategories = categories.filter((c) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return (
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        );
    });

    const handleAddCategory = () => {
        setEditingCategory(null);
        setNameInput("");
        setDescInput("");
        setIsModalOpen(true);
    };

    const handleEditCategory = (c: Category) => {
        setEditingCategory(c);
        setNameInput(c.name);
        setDescInput(c.description);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (id: string) => {
        // id is string now
        if (window.confirm("Delete this category?")) {
            try {
                // API call to delete category
                await axios.delete(`${API_BASE_URL}/category/${id}`, {
                    withCredentials: true,
                });
                setCategories(categories.filter((cat) => cat._id !== id));
            } catch (error) {
                console.error("Error deleting category:", error);
                alert("Failed to delete category.");
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setNameInput("");
        setDescInput("");
    };

    const handleSave = async () => {
        const trimmedName = nameInput.trim();
        const trimmedDesc = descInput.trim();
        if (!trimmedName) {
            alert("Name is required.");
            return;
        }

        try {
            if (editingCategory) {
                // Update existing category
                const updatedCategoryData = {
                    name: trimmedName,
                    description: trimmedDesc,
                };
                const res = await axios.put(
                    `${API_BASE_URL}/category/${editingCategory._id}`,
                    updatedCategoryData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );

                console.log(res);

                if (res.status === 200) {
                    // Replace the updated category in the local state
                    setCategories(
                        categories.map((cat) =>
                            cat._id === editingCategory._id
                                ? { ...cat, ...updatedCategoryData }
                                : cat
                        )
                    );
                    handleCloseModal();
                } else {
                    alert("Failed to update category.");
                }
            } else {
                // Add new category
                const newCategoryData = {
                    name: trimmedName,
                    description: trimmedDesc,
                };
                const res = await axios.post(
                    `${API_BASE_URL}/category`,
                    newCategoryData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );

                if (res.status === 200) {
                    // Add the new category returned from the API to the local state
                    setCategories([
                        ...categories,
                        res.data.category as Category,
                    ]);
                    handleCloseModal();
                } else {
                    alert("Failed to add category.");
                }
            }
        } catch (error) {
            console.error("Error saving category:", error);
            alert("An error occurred while saving the category.");
        }
    };

    const totalCategories = categories.length;

    return (
        <div className="min-h-screen overflow-x-hidden">
            <main className="p-8 bg-white/5">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h2 className="text-white text-3xl font-semibold mb-2">
                                Category Management
                            </h2>
                            <p className="text-white/70 text-lg">
                                Organize and manage your product categories
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-xl font-semibold hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                                📊 Export
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="px-6 py-3 bg-gradient-to-r from-red-400 to-yellow-400 text-white rounded-xl font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-red-400/40 flex items-center gap-2"
                            >
                                ➕ Add Category
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 mb-8">
                    <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm font-medium uppercase tracking-wide">
                                    Total Categories
                                </p>
                                <p className="text-white text-3xl font-bold">
                                    {totalCategories}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                                📂
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
                                className="w-full pl-12 pr-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                                placeholder="Search categories by name or description..."
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-lg">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-white text-xl font-semibold flex items-center gap-2">
                            📁 Categories List
                        </h3>
                    </div>

                    <ul className="space-y-3">
                        {filteredCategories.map((cat) => (
                            <li
                                key={cat._id} // Use _id for key
                                className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-start gap-4"
                            >
                                <div>
                                    <div className="text-white font-semibold text-lg">
                                        {cat.name}
                                    </div>
                                    <div className="text-white/70 text-sm">
                                        {cat.description}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditCategory(cat)}
                                        className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/15 transition"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={
                                            () => handleDeleteCategory(cat._id) // Use _id for delete
                                        }
                                        className="px-3 py-1 bg-red-500/30 text-white rounded-lg hover:bg-red-500/40 transition"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-white/70 text-lg">
                                No categories found matching your criteria
                            </p>
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="text-white text-xl font-semibold">
                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add New Category"}
                                </h4>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-white/70 hover:text-white text-xl p-1 rounded hover:bg-white/10 transition-all"
                                >
                                    ✖
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) =>
                                            setNameInput(e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                                        placeholder="Enter category name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={descInput}
                                        onChange={(e) =>
                                            setDescInput(e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 resize-vertical min-h-24"
                                        placeholder="Enter category description"
                                    />
                                </div>

                                <div className="flex gap-4 justify-end mt-8">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/15 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:-translate-y-1 transition-all shadow-lg"
                                    >
                                        {editingCategory
                                            ? "Update Category"
                                            : "Save Category"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
export default Categories;
