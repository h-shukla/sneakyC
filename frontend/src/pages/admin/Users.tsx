import { useState } from "react";

interface User {
    id: number;
    avatar: string;
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Viewer";
    status: "Active" | "Inactive" | "Banned";
    cart: cart[];
    wishlist: wishlist[];
}

interface wishlist {
    product: string;
}

interface cart {
    product: string;
    quantity: number;
}

const initialUsers: User[] = [
    {
        id: 1,
        avatar: "🧑‍💻",
        name: "Himanshu Shukla",
        email: "himanshu@example.com",
        role: "Admin",
        status: "Active",
        cart: [],
        wishlist: [],
    },
    {
        id: 2,
        avatar: "👩‍💼",
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        role: "Editor",
        status: "Inactive",
        cart: [],
        wishlist: [],
    },
    {
        id: 3,
        avatar: "👨‍🎓",
        name: "Ravi Kumar",
        email: "ravi.kumar@example.com",
        role: "Viewer",
        status: "Banned",
        cart: [],
        wishlist: [],
    },
];

const Users = () => {
    const [users] = useState<User[]>(initialUsers);
    const [showModal, setShowModal] = useState(false);

    const getStatusClass = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-200/20 text-green-500";
            case "Inactive":
                return "bg-yellow-200/20 text-yellow-400";
            case "Banned":
                return "bg-gray-400/20 text-gray-400";
            default:
                return "";
        }
    };

    return (
        <div className="flex-1 p-4 md:p-8 bg-white/5 min-h-screen">
            {/* Header */}
            <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 mb-6 flex justify-between items-center flex-wrap gap-4 shadow-md">
                <div>
                    <h2 className="text-white text-2xl font-semibold mb-1">
                        Users Management
                    </h2>
                    <p className="text-white/70 text-sm">
                        Manage registered users and access control
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary">📥 Export</button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        ➕ Add User
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                    <span className="mr-2 text-yellow-300">🔍</span>
                    <input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        className="bg-transparent outline-none text-white placeholder-white/60 w-48"
                    />
                </div>
                <select className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2">
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                </select>
                <select className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Banned</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-md">
                <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                    👥 Users List
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-left text-yellow-300 text-sm bg-white/10">
                                <th className="p-3">Avatar</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-white/10 text-white text-sm border-b border-white/10"
                                >
                                    <td className="p-3">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-400 to-yellow-400 flex items-center justify-center text-white text-lg font-bold">
                                            {user.avatar}
                                        </div>
                                    </td>
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                user.status
                                            )}`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-3 space-x-2">
                                        <button className="btn btn-sm btn-secondary">
                                            ✏️
                                        </button>
                                        <button className="btn btn-sm btn-danger">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex gap-2 mt-4">
                    <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-rose-400 transition">
                        1
                    </button>
                    <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-rose-400 transition">
                        2
                    </button>
                    <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-rose-400 transition">
                        Next ➤
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-2xl w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-white font-semibold text-lg">
                                Add New User
                            </h4>
                            <button
                                className="text-red-400 hover:bg-white/10 px-2 py-1 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                ✖
                            </button>
                        </div>
                        <form>
                            <div className="mb-4">
                                <label className="text-yellow-300 text-sm font-semibold block mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    className="form-input w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-yellow-300 text-sm font-semibold block mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    className="form-input w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-yellow-300 text-sm font-semibold block mb-1">
                                    Role
                                </label>
                                <select className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg">
                                    <option>Select role</option>
                                    <option>Admin</option>
                                    <option>Editor</option>
                                    <option>Viewer</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="text-yellow-300 text-sm font-semibold block mb-1">
                                    Status
                                </label>
                                <select className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg">
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>Banned</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
