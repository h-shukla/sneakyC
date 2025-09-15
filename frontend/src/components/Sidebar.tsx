import React, { useState } from "react";
import { Link, useLocation } from "react-router";

interface SidebarProps {
    activeItem?: string;
    onNavigate?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = () => {
    const location = useLocation();
    const [productsOpen, setProductsOpen] = useState(false);

    const menuItems = [
        { name: "Dashboard", href: "/admin" },
        {
            name: "Products",
            href: "/admin/products",
            dropdown: [
                { name: "Product Management", href: "/admin/products" },
                {
                    name: "Category Management",
                    href: "/admin/categories",
                },
            ],
        },
        { name: "Orders", href: "/admin/orders" },
        { name: "Users", href: "/admin/users" },
        { name: "Queries", href: "/admin/queries" },
        { name: "Settings", href: "/admin/settings" },
    ];

    return (
        <aside className="fixed top-0 left-0 h-screen w-72 bg-white/10 backdrop-blur-xl border-r border-white/20 py-8 shadow-xl overflow-y-auto z-10">
            {/* Logo Section */}
            <div className="px-8 pb-8 border-b border-white/10 mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                    SneakyC
                </h1>
                <p className="text-white/70 text-sm">Admin Dashboard</p>
            </div>

            {/* Navigation */}
            <nav>
                {menuItems.map((item) => {
                    if (item.dropdown) {
                        // Check if any dropdown item is active
                        const isDropdownActive = item.dropdown.some(
                            (sub) => location.pathname === sub.href
                        );
                        return (
                            <div key={item.name}>
                                <button
                                    type="button"
                                    className={`w-full text-left block px-8 py-4 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 border-l-3 border-transparent hover:border-red-400 hover:translate-x-1 font-medium ${
                                        isDropdownActive
                                            ? "bg-red-400/20 border-red-400 text-white"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setProductsOpen((open) => !open)
                                    }
                                >
                                    {item.name}
                                    <span className="float-right">
                                        {productsOpen ? "▲" : "▼"}
                                    </span>
                                </button>
                                {productsOpen && (
                                    <div className="ml-4">
                                        {item.dropdown.map((sub) => {
                                            const isActive =
                                                location.pathname === sub.href;
                                            return (
                                                <Link
                                                    key={sub.name}
                                                    to={sub.href}
                                                    className={`block px-8 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 border-l-3 border-transparent hover:border-red-400 hover:translate-x-1 font-medium ${
                                                        isActive
                                                            ? "bg-red-400/20 border-red-400 text-white"
                                                            : ""
                                                    }`}
                                                >
                                                    {sub.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    const isActive =
                        item.href !== "#" && location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`block px-8 py-4 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 border-l-3 border-transparent hover:border-red-400 hover:translate-x-1 font-medium ${
                                isActive
                                    ? "bg-red-400/20 border-red-400 text-white"
                                    : ""
                            }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
