import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { CartItem } from "../../contexts/CartProvider";
import type { RootState } from "../store";
import type { ProductInterface } from "../../interface/ProductInterface";

interface CartState extends AsyncState {
    cartItems: CartItem[];
}

interface AsyncState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: CartState = {
    cartItems: [],
    status: "idle",
    error: null,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const parseLocalCart = (): CartItem[] => {
    const str = localStorage.getItem("cart");
    if (!str) return [];
    try {
        return JSON.parse(str) as CartItem[];
    } catch (e) {
        localStorage.removeItem("cart");
        console.error(e);
        return [];
    }
};

const saveLocalCart = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
};

export const fetchCart = createAsyncThunk<CartItem[]>(
    "cart/fetchCart",
    async (_, thunkAPI) => {
        try {
            const resp = await axios.get<{
                success: boolean;
                cart: CartItem[];
            }>(`${API_BASE_URL}/cart`, {
                withCredentials: true,
            });
            const serverCart = resp.data.success ? resp.data.cart || [] : [];

            // merge with local cart (guest) if present
            const localCart = parseLocalCart();
            const merged = [...serverCart];
            for (const localItem of localCart) {
                const idx = merged.findIndex(
                    (it) => it.product?._id === localItem.product?._id
                );
                if (idx !== -1) merged[idx].quantity += localItem.quantity;
                else merged.push(localItem);
            }

            if (localCart.length > 0) {
                try {
                    await axios.post(
                        `${API_BASE_URL}/cart/merge`,
                        {
                            items: merged.map((it) => ({
                                productId: it.product?._id,
                                quantity: it.quantity,
                            })),
                        },
                        { withCredentials: true }
                    );
                    localStorage.removeItem("cart");
                } catch (err) {
                    console.error("Failed to merge cart:", err);
                }
            }

            return merged;
        } catch (err) {
            const axiosErr = err as AxiosError;
            // if unauthorized, return local cart
            if (axiosErr.response?.status === 401) {
                return parseLocalCart();
            }
            return thunkAPI.rejectWithValue(
                axiosErr.message ?? "Failed to fetch cart"
            );
        }
    }
);

export const addToCartAsync = createAsyncThunk<
    CartItem[] | CartItem[],
    { productId: string; quantity: number; product?: ProductInterface }
>("cart/addToCart", async (payload, thunkAPI) => {
    try {
        const resp = await axios.post<{ success: boolean; cart: CartItem[] }>(
            `${API_BASE_URL}/cart`,
            { productId: payload.productId, quantity: payload.quantity },
            { withCredentials: true }
        );
        if (resp.data.success) {
            return resp.data.cart || [];
        }
        return thunkAPI.rejectWithValue("Unable to add to cart");
    } catch (err) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 401) {
            // guest: update localStorage
            const local = parseLocalCart();
            const idx = local.findIndex(
                (it) => it.product?._id === payload.productId
            );
            if (idx !== -1) local[idx].quantity += payload.quantity;
            else
                local.push({
                    product: payload.product ?? null,
                    quantity: payload.quantity,
                });
            saveLocalCart(local);
            return local;
        }
        return thunkAPI.rejectWithValue(axiosErr.message ?? "Failed to add");
    }
});

export const updateCartItemAsync = createAsyncThunk<
    CartItem[] | CartItem[],
    { productId: string; quantity: number; product?: ProductInterface }
>("cart/updateCartItem", async (payload, thunkAPI) => {
    try {
        const resp = await axios.post<{ success: boolean; cart: CartItem[] }>(
            `${API_BASE_URL}/cart`,
            { productId: payload.productId, quantity: payload.quantity },
            { withCredentials: true }
        );
        if (resp.data.success) {
            return resp.data.cart || [];
        }
        return thunkAPI.rejectWithValue("Unable to update cart");
    } catch (err) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 401) {
            const local = parseLocalCart();
            let newCart: CartItem[];
            if (payload.quantity === 0) {
                newCart = local.filter(
                    (it) => it.product?._id !== payload.productId
                );
            } else {
                newCart = local.map((it) =>
                    it.product?._id === payload.productId
                        ? { ...it, quantity: payload.quantity }
                        : it
                );
            }
            saveLocalCart(newCart);
            return newCart;
        }
        return thunkAPI.rejectWithValue(axiosErr.message ?? "Failed to update");
    }
});

export const removeFromCartAsync = createAsyncThunk<
    CartItem[] | CartItem[],
    { productId: string }
>("cart/removeFromCart", async ({ productId }, thunkAPI) => {
    try {
        const resp = await axios.delete<{ success: boolean; cart: CartItem[] }>(
            `${API_BASE_URL}/cart/${productId}`,
            {
                withCredentials: true,
            }
        );
        if (resp.data.success) return resp.data.cart || [];
        return thunkAPI.rejectWithValue("Unable to remove from cart");
    } catch (err) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 401) {
            const local = parseLocalCart().filter(
                (it) => it.product?._id !== productId
            );
            saveLocalCart(local);
            return local;
        }
        return thunkAPI.rejectWithValue(axiosErr.message ?? "Failed to remove");
    }
});

export const clearCartAsync = createAsyncThunk<void>(
    "cart/clearCart",
    async () => {
        // for now, clear local and optionally backend; ignore errors
        try {
            await axios.delete(`${API_BASE_URL}/cart`, {
                withCredentials: true,
            });
        } catch (e) {
            console.error("Failed to clear cart on server:", e);
        }
        localStorage.removeItem("cart");
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.cartItems.find(
                (item) => item.product?._id === action.payload.product?._id
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.cartItems.push(action.payload);
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cartItems = state.cartItems.filter(
                (item) => item.product?._id !== action.payload
            );
        },
        updateCartItem: (
            state,
            action: PayloadAction<{ id: string; updates: Partial<CartItem> }>
        ) => {
            const item = state.cartItems.find(
                (i) => i.product?._id === action.payload.id
            );
            if (item) {
                Object.assign(item, action.payload.updates);
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
        setCartItems: (state, action: PayloadAction<CartItem[]>) => {
            state.cartItems = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                fetchCart.fulfilled,
                (state, action: PayloadAction<CartItem[]>) => {
                    state.cartItems = action.payload;
                    state.status = "succeeded";
                }
            )
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message ?? "Failed to fetch cart";
            })
            .addCase(
                addToCartAsync.fulfilled,
                (state, action: PayloadAction<CartItem[] | CartItem[]>) => {
                    state.cartItems = action.payload as CartItem[];
                    toast.success("Item added to cart");
                }
            )
            .addCase(
                updateCartItemAsync.fulfilled,
                (state, action: PayloadAction<CartItem[] | CartItem[]>) => {
                    state.cartItems = action.payload as CartItem[];
                }
            )
            .addCase(
                removeFromCartAsync.fulfilled,
                (state, action: PayloadAction<CartItem[] | CartItem[]>) => {
                    state.cartItems = action.payload as CartItem[];
                    toast.success("Item removed from cart");
                }
            )
            .addCase(clearCartAsync.fulfilled, (state) => {
                state.cartItems = [];
            });
    },
});

export const {
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    setCartItems,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.cartItems;
export const selectCartItemCount = (state: RootState) =>
    state.cart.cartItems.reduce((sum, it) => sum + it.quantity, 0);
export const selectCartTotalPrice = (state: RootState) =>
    state.cart.cartItems.reduce(
        (sum, it) => sum + (it.product?.price ?? 0) * it.quantity,
        0
    );
export const selectCartStatus = (state: RootState) => ({
    status: state.cart.status,
    error: state.cart.error,
});

export default cartSlice.reducer;
