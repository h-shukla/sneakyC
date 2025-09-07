import { useEffect, useState } from "react";
import axios from "axios";

interface ShippingInfo {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
    phoneNo: number;
}

interface Order {
    _id: string;
    shippingInfo: ShippingInfo;
    orderItems: { _id: string; name?: string; image?: string }[];
    user: { _id: string; name?: string; email?: string };
    paymentInfo: string;
    itemsPrice: number;
    orderStatus: string;
    deliveredAt?: string;
    createdAt: string;
}

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [status, setStatus] = useState("");

    // ✅ Extract proper error messages
    const getErrorMessage = (err: unknown): string => {
        if (axios.isAxiosError(err)) {
            const message =
                err.response?.data?.message || err.response?.data?.error;
            if (typeof message === "string") {
                return message;
            }
            return err.message || "An API error occurred.";
        }
        if (err instanceof Error) {
            return err.message;
        }
        return "An unexpected error occurred.";
    };

    // Fetch orders
    const getOrders = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/admin/orders`,
                { withCredentials: true }
            );
            setOrders(res.data.orders);
        } catch (err) {
            setError(`Failed to fetch orders. ${getErrorMessage(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editOrder) return;

        setIsLoading(true);
        setError("");
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/admin/order/${
                    editOrder._id
                }`,
                { orderStatus: status },
                { withCredentials: true }
            );
            await getOrders();
            setShowModal(false);
        } catch (err) {
            setError(`Failed to update order. ${getErrorMessage(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this order?"))
            return;

        setIsLoading(true);
        setError("");
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/admin/order/${id}`,
                { withCredentials: true }
            );
            await getOrders();
        } catch (err) {
            setError(`Failed to delete order. ${getErrorMessage(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
    }, []); // eslint-disable-line

    const filteredOrders = orders.filter((o) => {
        const q = searchTerm.toLowerCase();
        return (
            o._id.toLowerCase().includes(q) ||
            o.user?.name?.toLowerCase().includes(q) ||
            o.user?.email?.toLowerCase().includes(q) ||
            o.orderStatus.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen overflow-x-hidden">
            <main className="p-8 bg-white/5">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h2 className="text-white text-3xl font-semibold mb-2">
                                Orders Management
                            </h2>
                            <p className="text-white/70 text-lg">
                                Track, update, and manage customer orders
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mb-8">
                    <div className="flex-1 bg-white/10 rounded-3xl p-6 border border-white/20 shadow-lg">
                        <p className="text-white/70 text-sm uppercase tracking-wide">
                            Total Orders
                        </p>
                        <p className="text-white text-3xl font-bold">
                            {orders.length}
                        </p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-3xl p-6 border border-white/20 shadow-lg">
                        <p className="text-white/70 text-sm uppercase tracking-wide">
                            Search
                        </p>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full mt-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-green-500/70"
                            placeholder="Search by ID, user, status..."
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Loader */}
                {isLoading && (
                    <div className="text-center py-10 text-white">
                        Loading...
                    </div>
                )}

                {/* Orders Table */}
                <div className="overflow-x-auto bg-white/10 rounded-3xl border border-white/20 shadow-lg">
                    <table className="w-full text-left text-white">
                        <thead className="bg-white/10 text-sm uppercase">
                            <tr>
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Items</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="border-t border-white/10"
                                >
                                    <td className="px-4 py-3">{order._id}</td>
                                    <td className="px-4 py-3">
                                        {order.user?.name || "Unknown"}
                                        <br />
                                        <span className="text-sm text-white/60">
                                            {order.user?.email}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {order.orderItems.length}
                                    </td>
                                    <td className="px-4 py-3">
                                        ₹{order.itemsPrice}
                                    </td>
                                    <td className="px-4 py-3">
                                        {order.orderStatus}
                                    </td>
                                    <td className="px-4 py-3">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditOrder(order);
                                                setStatus(order.orderStatus);
                                                setShowModal(true);
                                            }}
                                            className="px-3 py-1 bg-blue-500/30 rounded-lg hover:bg-blue-500/50"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteOrder(order._id)
                                            }
                                            className="px-3 py-1 bg-red-500/30 rounded-lg hover:bg-red-500/50"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && !isLoading && (
                        <div className="text-center py-10 text-white/60">
                            No orders found.
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {showModal && editOrder && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 p-4">
                        <div className="bg-black/60 border border-white/20 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6 text-white">
                                Update Order
                            </h2>
                            <form
                                onSubmit={handleUpdateOrder}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-white/80 text-sm mb-2">
                                        Order Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-xl bg-[#0e0913] text-white border border-white/20 focus:ring-2 focus:ring-green-500/70"
                                    >
                                        <option value="Processing">
                                            Processing
                                        </option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">
                                            Delivered
                                        </option>
                                        <option value="Cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:-translate-y-1 shadow-lg"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Orders;
