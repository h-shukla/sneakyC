import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./cartContext";
import type { ProductInterface } from "../interface/ProductInterface";

export interface CartContextType {
    cartItems: Array<ProductInterface>;
    addToCart: (product: ProductInterface) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    getCartItemCount: () => number;
    getCartTotalPrice: () => number;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<ProductInterface[]>([]);

    const addToCart = useCallback((product: ProductInterface) => {
        setCartItems((prev) => [...prev, product]);
    }, []);

    const removeFromCart = useCallback((productId: string) => {
        setCartItems((prev) => prev.filter((item) => item._id !== productId));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const getCartItemCount = useCallback(() => {
        return cartItems.length;
    }, [cartItems]);

    const getCartTotalPrice = useCallback(() => {
        return cartItems.reduce((total, item) => total + (item.price || 0), 0);
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
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
