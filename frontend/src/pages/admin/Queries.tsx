import React from "react";

type QueryStatus = "open" | "pending" | "closed";

interface Query {
    name: string;
    email: string;
    query: string;
    date: string;
    status: QueryStatus;
}

const queries: Query[] = [
    {
        name: "Arjun Patel",
        email: "arjun.p@email.com",
        query: "How can I track my order?",
        date: "25 Jul 2025",
        status: "open",
    },
    {
        name: "Priya Sharma",
        email: "priya.s@email.com",
        query: "Received wrong product, what to do?",
        date: "24 Jul 2025",
        status: "pending",
    },
    {
        name: "Raj Kumar",
        email: "raj.k@email.com",
        query: "Can I change my delivery address?",
        date: "23 Jul 2025",
        status: "closed",
    },
    {
        name: "Sneha Gupta",
        email: "sneha.g@email.com",
        query: "Is COD available in my area?",
        date: "22 Jul 2025",
        status: "open",
    },
    {
        name: "Vikram Singh",
        email: "vikram.s@email.com",
        query: "How to return a product?",
        date: "21 Jul 2025",
        status: "pending",
    },
];

const statusBadgeClasses: Record<QueryStatus, string> = {
    open: "bg-green-200/20 text-green-500",
    pending: "bg-yellow-200/20 text-yellow-400",
    closed: "bg-gray-300/20 text-gray-400",
};

const Queries: React.FC = () => {
    return (
        <div className="flex-1 p-6 bg-white/5">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-lg">
                <h2 className="text-white text-2xl font-semibold mb-1">
                    Customer Queries
                </h2>
                <p className="text-white/70 text-sm">
                    Manage and respond to customer questions and issues
                </p>
            </div>

            {/* Table Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
                <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                    📬 Recent Queries
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-white/10 border-b border-white/20">
                                <th className="text-yellow-400 text-left text-base font-bold px-4 py-3">
                                    Name
                                </th>
                                <th className="text-yellow-400 text-left text-base font-bold px-4 py-3">
                                    Email
                                </th>
                                <th className="text-yellow-400 text-left text-base font-bold px-4 py-3">
                                    Query
                                </th>
                                <th className="text-yellow-400 text-left text-base font-bold px-4 py-3">
                                    Date
                                </th>
                                <th className="text-yellow-400 text-left text-base font-bold px-4 py-3">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {queries.map((q, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-white/10 transition-colors border-b border-white/10"
                                >
                                    <td className="text-white/90 px-4 py-3 text-sm">
                                        {q.name}
                                    </td>
                                    <td className="text-white/90 px-4 py-3 text-sm">
                                        {q.email}
                                    </td>
                                    <td className="text-white/90 px-4 py-3 text-sm">
                                        {q.query}
                                    </td>
                                    <td className="text-white/90 px-4 py-3 text-sm">
                                        {q.date}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full font-semibold text-sm ${
                                                statusBadgeClasses[q.status]
                                            }`}
                                        >
                                            {q.status.charAt(0).toUpperCase() +
                                                q.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Queries;
