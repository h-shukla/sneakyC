import { createContext, useContext } from "react";
import type { CartContextType } from "./CartProvider";

// Create the context with a default value (must satisfy CartContextType).
export const CartContext = createContext<CartContextType>({
    cartItems: [],
    addToCart: async () => {},
    removeFromCart: async () => {},
    updateCartItem: async () => {},
    clearCart: async () => {},
    getCartItemCount: () => 0,
    getCartTotalPrice: () => 0,
    fetchCart: async () => {},
});

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within an Cartprovider");
    }
    return context;
};
