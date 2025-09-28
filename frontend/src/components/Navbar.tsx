import { useState } from "react";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../contexts/authContext";
import { useCart } from "../contexts/cartContext";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const { getCartItemCount } = useCart(); // ✅ Access cart count
    const cartCount = getCartItemCount(); // ✅ Compute cart count

    return (
        <div className="w-full">
            {/* Promotional Banner */}
            <div className="bg-black text-white text-center py-3 px-4 text-sm font-medium">
                Welcome Offer Flat 50% off on all products. Enjoy Shopping the
                most premium Sneakers.
            </div>

            {/* Main Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/">
                                <img
                                    src="/logo.png"
                                    alt="SneakyC Logo"
                                    className="h-18 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-yellow-500 font-medium transition-colors duration-200"
                            >
                                Home
                            </Link>
                            <Link
                                to="/products"
                                className="text-gray-700 hover:text-yellow-500 font-medium transition-colors duration-200"
                            >
                                Products
                            </Link>
                            <a
                                href="#"
                                className="text-gray-700 hover:text-yellow-500 font-medium transition-colors duration-200"
                            >
                                Contact
                            </a>
                            <a
                                href="#"
                                className="text-gray-700 hover:text-yellow-500 font-medium transition-colors duration-200"
                            >
                                About
                            </a>
                            {isLoggedIn() ? (
                                <button
                                    className="bg-red-400 rounded-full px-6 py-2 text-gray-200 hover:bg-yellow-500 hover:text-gray-800 font-medium transition-colors duration-200"
                                    onClick={logout}
                                >
                                    Log Out
                                </button>
                            ) : (
                                <Link
                                    to="/signup"
                                    className="bg-yellow-500 text-white px-6 py-2 rounded-full font-medium hover:bg-yellow-600 transition-colors duration-200"
                                >
                                    Sign Up
                                </Link>
                            )}
                        </div>

                        {/* Search Bar */}
                        <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="What are you looking for?"
                                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                />
                                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <Search className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors duration-200" />
                                </button>
                            </div>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Wishlist */}
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative">
                                <Heart className="h-6 w-6 text-gray-600 hover:text-yellow-500" />
                                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    0
                                </span>
                            </button>

                            {/* Shopping Cart */}
                            <Link
                                to="/cart"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
                            >
                                <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-yellow-500" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6 text-gray-600" />
                                ) : (
                                    <Menu className="h-6 w-6 text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="px-4 pt-4 pb-6 space-y-4">
                            {/* Mobile Search */}
                            <div className="lg:hidden">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="What are you looking for?"
                                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    />
                                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Navigation Links */}
                            <div className="space-y-3">
                                <a
                                    href="#"
                                    className="block text-gray-700 hover:text-yellow-500 font-medium py-2 transition-colors duration-200"
                                >
                                    Home
                                </a>
                                <a
                                    href="#"
                                    className="block text-gray-700 hover:text-yellow-500 font-medium py-2 transition-colors duration-200"
                                >
                                    Products
                                </a>
                                <a
                                    href="#"
                                    className="block text-gray-700 hover:text-yellow-500 font-medium py-2 transition-colors duration-200"
                                >
                                    Contact
                                </a>
                                <a
                                    href="#"
                                    className="block text-gray-700 hover:text-yellow-500 font-medium py-2 transition-colors duration-200"
                                >
                                    About
                                </a>
                                {isLoggedIn() ? (
                                    <button
                                        className="bg-red-400 rounded-full px-6 py-2 text-gray-200 hover:bg-yellow-500 hover:text-gray-800 font-medium transition-colors duration-200"
                                        onClick={logout}
                                    >
                                        Log Out
                                    </button>
                                ) : (
                                    <Link
                                        to="/signup"
                                        className="block bg-yellow-500 text-white px-6 py-3 rounded-full font-medium hover:bg-yellow-600 transition-colors duration-200 text-center mt-4"
                                    >
                                        Sign Up
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
