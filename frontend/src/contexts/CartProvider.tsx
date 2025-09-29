import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./cartContext";
import type { ProductInterface } from "../interface/ProductInterface";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./authContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CartItem {
    product: ProductInterface | null;
    quantity: number;
}

export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: ProductInterface, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => void;
    getCartItemCount: () => number;
    getCartTotalPrice: () => number;
    fetchCart: () => Promise<void>;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { isLoggedIn } = useAuth();

    // Fetch cart items on load
    const fetchCart = useCallback(async () => {
        if (isLoggedIn()) {
            try {
                const response = await axios.get(`${API_BASE_URL}/cart`, {
                    withCredentials: true,
                });
                if (response.data.success) {
                    setCartItems(response.data.cart);
                }
            } catch (error) {
                setCartItems([]);
                console.error("Error fetching cart:", error);
            }
        } else {
            const localCart = localStorage.getItem("cart");
            if (localCart) {
                setCartItems(JSON.parse(localCart));
            } else {
                setCartItems([]);
            }
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add or update cart item
    const addToCart = useCallback(
        async (product: ProductInterface, quantity: number) => {
            if (isLoggedIn()) {
                try {
                    const response = await axios.post(
                        `${API_BASE_URL}/cart`,
                        { productId: product._id, quantity },
                        { withCredentials: true }
                    );
                    if (response.data.success) {
                        await fetchCart();
                        toast.success("Item added to cart");
                    }
                } catch (error) {
                    console.error("Error adding to cart:", error);
                    toast.error("Failed to add item to cart");
                }
            } else {
                setCartItems((prevItems) => {
                    const existingIndex = prevItems.findIndex(
                        (item) => item.product?._id === product._id
                    );
                    let newCart;
                    if (existingIndex !== -1) {
                        newCart = prevItems.map((item, idx) =>
                            idx === existingIndex
                                ? {
                                      ...item,
                                      quantity: item.quantity + quantity,
                                  }
                                : item
                        );
                    } else {
                        newCart = [...prevItems, { product, quantity }];
                    }
                    localStorage.setItem("cart", JSON.stringify(newCart));
                    toast.success("Item added to cart");
                    return newCart;
                });
            }
        },
        [fetchCart, isLoggedIn]
    );

    // Remove item from cart
    const removeFromCart = useCallback(
        async (productId: string) => {
            if (isLoggedIn()) {
                try {
                    const response = await axios.delete(
                        `${API_BASE_URL}/cart/${productId}`,
                        {
                            withCredentials: true,
                        }
                    );
                    if (response.data.success) {
                        setCartItems(response.data.cart);
                    }
                } catch (error) {
                    console.error("Error removing item from cart:", error);
                }
            } else {
                setCartItems((prevItems) => {
                    const newCart = prevItems.filter(
                        (item) => item.product?._id !== productId
                    );
                    localStorage.setItem("cart", JSON.stringify(newCart));
                    return newCart;
                });
            }
        },
        [isLoggedIn]
    );

    // Clear all cart items
    const clearCart = useCallback(() => {
        if (isLoggedIn()) {
            setCartItems([]);
            // Optionally, you can call an API endpoint to clear the cart on the backend
        } else {
            setCartItems([]);
            localStorage.removeItem("cart");
        }
    }, [isLoggedIn]);

    const getCartItemCount = useCallback(() => {
        return cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }, [cartItems]);

    const getCartTotalPrice = useCallback(() => {
        return cartItems.reduce((total, item) => {
            return total + (item.product?.price || 0) * item.quantity;
        }, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                getCartItemCount,
                getCartTotalPrice,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
