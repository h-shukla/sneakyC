import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./cartContext";
import type { ProductInterface } from "../interface/ProductInterface";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CartItem {
    product: ProductInterface | null; // can be null if product is deleted
    quantity: number;
}

export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => void;
    getCartItemCount: () => number;
    getCartTotalPrice: () => number;
    fetchCart: () => Promise<void>;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Fetch cart items on load
    const fetchCart = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/cart`, {
                withCredentials: true,
            });
            if (response.data.success) {
                setCartItems(response.data.cart);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add or update cart item
    const addToCart = useCallback(
        async (productId: string, quantity: number) => {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/cart`,
                    { productId, quantity },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    // Option 1: Re-fetch entire cart (simpler, ensures consistency)
                    await fetchCart();
                    toast.success("Item added to cart");
                }
            } catch (error) {
                console.error("Error adding to cart:", error);
                toast.error("Failed to add item to cart");
            }
        },
        [fetchCart]
    );

    // Remove item from cart
    const removeFromCart = useCallback(async (productId: string) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/cart/${productId}`,
                {
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                // Update local state
                setCartItems(response.data.cart);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    }, []);

    // Clear all cart items locally (no backend support yet)
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

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
