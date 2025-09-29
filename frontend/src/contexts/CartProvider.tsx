// cartContext.tsx

import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./cartContext"; // If you’re declaring in same file, don’t re-import; see below
import type { ProductInterface } from "../interface/ProductInterface";
import axios from "axios";
import type { AxiosError } from "axios";
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
    removeFromCart: (productId: string, quantity?: number) => Promise<void>;
    updateCartItem: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getCartItemCount: () => number;
    getCartTotalPrice: () => number;
    fetchCart: () => Promise<void>;
}

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { isLoggedIn } = useAuth();

    const fetchCart = useCallback(async (): Promise<void> => {
        if (isLoggedIn()) {
            try {
                type CartApiResponse = { success: boolean; cart: CartItem[] };

                // 1. Get server cart
                const response = await axios.get<CartApiResponse>(
                    `${API_BASE_URL}/cart`,
                    { withCredentials: true }
                );

                const serverCart: CartItem[] = response.data.success
                    ? response.data.cart
                    : [];

                // 2. Check localStorage cart
                const localCartStr = localStorage.getItem("cart");
                let localCart: CartItem[] = [];
                if (localCartStr) {
                    try {
                        localCart = JSON.parse(localCartStr) as CartItem[];
                    } catch (err) {
                        console.error("Error parsing local cart:", err);
                        localCart = [];
                        localStorage.removeItem("cart");
                    }
                }

                // 3. Merge logic: for same productId, add quantities
                const mergedCart: CartItem[] = [...serverCart];

                for (const localItem of localCart) {
                    const idx = mergedCart.findIndex(
                        (it) => it.product?._id === localItem.product?._id
                    );
                    if (idx !== -1) {
                        mergedCart[idx].quantity += localItem.quantity;
                    } else {
                        mergedCart.push(localItem);
                    }
                }

                // 4. Save merged cart to backend
                if (localCart.length > 0) {
                    try {
                        await axios.post(
                            `${API_BASE_URL}/cart/merge`,
                            {
                                items: mergedCart.map((it) => ({
                                    productId: it.product?._id,
                                    quantity: it.quantity,
                                })),
                            },
                            { withCredentials: true }
                        );
                    } catch (mergeErr) {
                        console.error("Error merging carts:", mergeErr);
                    }

                    // clear local cart after merging
                    localStorage.removeItem("cart");
                }

                setCartItems(mergedCart);
            } catch (error) {
                console.error("Error fetching cart:", error);
                setCartItems([]);
            }
        } else {
            // guest: only local storage
            const localCart = localStorage.getItem("cart");
            if (localCart) {
                try {
                    setCartItems(JSON.parse(localCart) as CartItem[]);
                } catch (err) {
                    console.error("Error parsing local cart:", err);
                    setCartItems([]);
                    localStorage.removeItem("cart");
                }
            } else {
                setCartItems([]);
            }
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = useCallback(
        async (product: ProductInterface, quantity: number): Promise<void> => {
            if (quantity <= 0) {
                toast.error("Quantity must be greater than 0");
                return;
            }

            if (isLoggedIn()) {
                try {
                    type CartApiResponse = {
                        success: boolean;
                        cart: CartItem[];
                    };
                    const resp = await axios.post<CartApiResponse>(
                        `${API_BASE_URL}/cart`,
                        { productId: product._id, quantity },
                        { withCredentials: true }
                    );
                    if (resp.data.success) {
                        await fetchCart();
                        toast.success("Item added to cart");
                    } else {
                        toast.error("Unable to add to cart");
                    }
                } catch (err) {
                    const axiosErr = err as AxiosError<{ message?: string }>;
                    console.error("Error adding to cart:", axiosErr);
                    toast.error(
                        axiosErr.response?.data?.message ?? "Failed to add item"
                    );
                }
            } else {
                setCartItems((prev) => {
                    const idx = prev.findIndex(
                        (it) => it.product?._id === product._id
                    );
                    let newCart: CartItem[];
                    if (idx !== -1) {
                        newCart = prev.map((it, i) =>
                            i === idx
                                ? { ...it, quantity: it.quantity + quantity }
                                : it
                        );
                    } else {
                        newCart = [...prev, { product, quantity }];
                    }
                    localStorage.setItem("cart", JSON.stringify(newCart));
                    toast.success("Item added to cart");
                    return newCart;
                });
            }
        },
        [isLoggedIn, fetchCart]
    );

    const updateCartItem = useCallback(
        async (productId: string, quantity: number): Promise<void> => {
            if (quantity < 0) {
                toast.error("Quantity cannot be negative");
                return;
            }

            if (isLoggedIn()) {
                try {
                    type CartApiResponse = {
                        success: boolean;
                        cart: CartItem[];
                    };
                    const resp = await axios.post<CartApiResponse>(
                        `${API_BASE_URL}/cart`,
                        { productId, quantity },
                        { withCredentials: true }
                    );
                    if (resp.data.success) {
                        await fetchCart();
                    } else {
                        toast.error("Unable to update cart");
                    }
                } catch (err) {
                    const axiosErr = err as AxiosError<{ message?: string }>;
                    console.error("Error updating cart:", axiosErr);
                    toast.error(
                        axiosErr.response?.data?.message ??
                            "Failed to update cart"
                    );
                }
            } else {
                setCartItems((prev) => {
                    let newCart: CartItem[];
                    if (quantity === 0) {
                        newCart = prev.filter(
                            (it) => it.product?._id !== productId
                        );
                    } else {
                        newCart = prev.map((it) =>
                            it.product?._id === productId
                                ? { ...it, quantity }
                                : it
                        );
                    }
                    localStorage.setItem("cart", JSON.stringify(newCart));
                    return newCart;
                });
            }
        },
        [isLoggedIn, fetchCart]
    );

    const removeFromCart = useCallback(
        async (productId: string): Promise<void> => {
            if (isLoggedIn()) {
                try {
                    type CartApiResponse = {
                        success: boolean;
                        cart: CartItem[];
                    };
                    const resp = await axios.delete<CartApiResponse>(
                        `${API_BASE_URL}/cart/${productId}`,
                        { withCredentials: true }
                    );
                    if (resp.data.success) {
                        fetchCart();
                        toast.success("Item removed from cart");
                    } else {
                        toast.error("Unable to remove from cart");
                    }
                } catch (err) {
                    const axiosErr = err as AxiosError<{ message?: string }>;
                    console.error("Error removing from cart:", axiosErr);
                    toast.error(
                        axiosErr.response?.data?.message ??
                            "Failed to remove item"
                    );
                }
            } else {
                setCartItems((prev) => {
                    const newCart = prev.filter(
                        (it) => it.product?._id !== productId
                    );
                    localStorage.setItem("cart", JSON.stringify(newCart));
                    return newCart;
                });
                toast.success("Item removed from cart");
            }
        },
        [isLoggedIn]
    );

    const clearCart = useCallback(async (): Promise<void> => {
        if (isLoggedIn()) {
            try {
                setCartItems([]);
                // optionally call backend to clear server cart
            } catch (err) {
                console.error("Error clearing cart:", err);
                toast.error("Failed to clear cart");
            }
        } else {
            setCartItems([]);
            localStorage.removeItem("cart");
        }
    }, [isLoggedIn]);

    const getCartItemCount = useCallback((): number => {
        return cartItems.reduce((sum, it) => sum + it.quantity, 0);
    }, [cartItems]);

    const getCartTotalPrice = useCallback((): number => {
        return cartItems.reduce((sum, it) => {
            const price = it.product?.price ?? 0;
            return sum + price * it.quantity;
        }, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateCartItem,
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
