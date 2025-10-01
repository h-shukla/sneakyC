import { useNavigate } from "react-router";
import { useCart } from "../contexts/cartContext";
import { useState } from "react";
import { useAuth } from "../contexts/authContext";

const CartPage = () => {
    const { cartItems, removeFromCart, updateCartItem, getCartTotalPrice } =
        useCart();

    const [loadingItem, setLoadingItem] = useState<string | null>(null);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const handleIncrement = async (productId: string) => {
        setLoadingItem(productId);
        try {
            const item = cartItems.find((it) => it.product?._id === productId);
            if (item && item.product) {
                // Increase quantity by 1 using updateCartItem
                await updateCartItem(productId, item.quantity + 1);
            }
        } catch (err) {
            console.error("Failed to increment item:", err);
        } finally {
            setLoadingItem(null);
        }
    };

    const handleDecrement = async (productId: string) => {
        setLoadingItem(productId);
        try {
            const item = cartItems.find((it) => it.product?._id === productId);
            if (item) {
                if (item.quantity <= 1) {
                    // If at 1 or less, remove completely
                    await removeFromCart(productId);
                } else {
                    await updateCartItem(productId, item.quantity - 1);
                }
            }
        } catch (err) {
            console.error("Failed to decrement item:", err);
        } finally {
            setLoadingItem(null);
        }
    };

    const handleRemove = async (productId: string) => {
        setLoadingItem(productId);
        try {
            await removeFromCart(productId);
        } catch (err) {
            console.error("Failed to remove item:", err);
        } finally {
            setLoadingItem(null);
        }
    };

    const handleCheckout = () => {
        if (isLoggedIn()) navigate("/order-summary");
        else navigate("/login");
    };
    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Shopping Cart
                        </h2>
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.product!._id}
                                    className="mb-4 bg-white rounded-lg shadow p-4"
                                >
                                    {item.product ? (
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 flex-shrink-0">
                                                <img
                                                    src={
                                                        item.product
                                                            .imagePublicId &&
                                                        item.product
                                                            .imagePublicId
                                                            .length > 0
                                                            ? import.meta.env
                                                                  .VITE_API_BASE_URL +
                                                              "/" +
                                                              item.product
                                                                  .imagePublicId[0]
                                                            : "/placeholder.png"
                                                    }
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-gray-600 mb-2">
                                                    ₹ {item.product.price}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 border"
                                                        onClick={() =>
                                                            handleDecrement(
                                                                item.product!
                                                                    ._id
                                                            )
                                                        }
                                                        aria-label="Decrease quantity"
                                                        disabled={
                                                            loadingItem ===
                                                            item.product!._id
                                                        }
                                                    >
                                                        –
                                                    </button>
                                                    <span className="w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 border"
                                                        onClick={() =>
                                                            handleIncrement(
                                                                item.product!
                                                                    ._id
                                                            )
                                                        }
                                                        aria-label="Increase quantity"
                                                        disabled={
                                                            loadingItem ===
                                                            item.product!._id
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        className="ml-4 px-3 py-1 text-red-600 hover:text-red-800 border border-red-200 rounded"
                                                        onClick={() =>
                                                            handleRemove(
                                                                item.product!
                                                                    ._id
                                                            )
                                                        }
                                                        aria-label="Remove item"
                                                        disabled={
                                                            loadingItem ===
                                                            item.product!._id
                                                        }
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-right min-w-[80px] flex flex-col justify-between">
                                                <p className="font-semibold">
                                                    ₹
                                                    {(
                                                        item.product.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-gray-500">
                                            This product is no longer available
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Order Summary
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{getCartTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>
                                        ₹{getCartTotalPrice().toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mt-4"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
