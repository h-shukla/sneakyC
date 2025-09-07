import React from "react";

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    trendIcon: string;
}

interface UserItemProps {
    initials: string;
    name: string;
    email: string;
    lastSeen: string;
    status: "active" | "pending" | "inactive";
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    isPositive,
    trendIcon,
}) => (
    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400"></div>
        <div className="flex justify-between items-center mb-4">
            <span className="text-white/80 text-sm font-medium uppercase tracking-wide">
                {title}
            </span>
            <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    isPositive ? "bg-green-500/20" : "bg-red-500/20"
                }`}
            >
                {trendIcon}
            </div>
        </div>
        <div className="text-white text-4xl font-bold mb-2">{value}</div>
        <div
            className={`text-sm font-semibold ${
                isPositive ? "text-green-400" : "text-red-400"
            }`}
        >
            {change}
        </div>
    </div>
);

const UserItem: React.FC<UserItemProps> = ({
    initials,
    name,
    email,
    lastSeen,
    status,
}) => {
    const statusStyles = {
        active: "bg-green-500/20 text-green-400",
        pending: "bg-yellow-500/20 text-yellow-400",
        inactive: "bg-gray-500/20 text-gray-400",
    };

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl mb-3 bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:translate-x-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-yellow-400 flex items-center justify-center font-semibold text-white">
                {initials}
            </div>
            <div className="flex-1">
                <h4 className="text-white text-base font-semibold mb-1">
                    {name}
                </h4>
                <p className="text-white/60 text-sm">
                    {email} • {lastSeen}
                </p>
            </div>
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[status]}`}
            >
                {status}
            </span>
        </div>
    );
};

const ChartBar: React.FC<{ height: string }> = ({ height }) => (
    <div
        className="flex-1 bg-gradient-to-t from-red-400/30 to-red-400/80 rounded-t min-h-5 transition-all duration-300 hover:from-red-400/50 hover:to-red-400 hover:scale-y-110"
        style={{ height }}
    ></div>
);

const Dashboard: React.FC = () => {
    const stats = [
        {
            title: "Daily Sales",
            value: "₹5,490",
            change: "+12.5% from yesterday",
            isPositive: true,
            trendIcon: "↗️",
        },
        {
            title: "Monthly Sales",
            value: "₹1,12,392",
            change: "-3.2% from last month",
            isPositive: false,
            trendIcon: "↘️",
        },
        {
            title: "Quarterly Sales",
            value: "₹8,78,920",
            change: "+18.7% from last quarter",
            isPositive: true,
            trendIcon: "↗️",
        },
    ];

    const users = [
        {
            initials: "AP",
            name: "Arjun Patel",
            email: "arjun.p@email.com",
            lastSeen: "2 hours ago",
            status: "active" as const,
        },
        {
            initials: "PS",
            name: "Priya Sharma",
            email: "priya.s@email.com",
            lastSeen: "5 hours ago",
            status: "active" as const,
        },
        {
            initials: "RK",
            name: "Raj Kumar",
            email: "raj.k@email.com",
            lastSeen: "1 day ago",
            status: "pending" as const,
        },
        {
            initials: "SG",
            name: "Sneha Gupta",
            email: "sneha.g@email.com",
            lastSeen: "2 days ago",
            status: "active" as const,
        },
        {
            initials: "VS",
            name: "Vikram Singh",
            email: "vikram.s@email.com",
            lastSeen: "3 days ago",
            status: "inactive" as const,
        },
    ];

    const chartData = [
        "65%",
        "78%",
        "82%",
        "74%",
        "89%",
        "95%",
        "92%",
        "88%",
        "91%",
        "85%",
        "79%",
        "83%",
    ];
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Main Content */}
            <main className="p-8 bg-white/5">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
                    <h2 className="text-white text-3xl font-semibold mb-2">
                        Welcome back, Admin
                    </h2>
                    <p className="text-white/70 text-base">
                        Here's what's happening with your business today
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Recent Users */}
                    <div className="xl:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-lg">
                        <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
                            👥 Recent Users
                        </h3>
                        <div>
                            {users.map((user, index) => (
                                <UserItem key={index} {...user} />
                            ))}
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-lg">
                        <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
                            📈 Over the Year
                        </h3>
                        <div className="h-48 flex items-end justify-between gap-1 mb-4">
                            {chartData.map((height, index) => (
                                <ChartBar key={index} height={height} />
                            ))}
                        </div>
                        <div className="flex justify-between">
                            {months.map((month, index) => (
                                <span
                                    key={index}
                                    className="text-white/60 text-xs font-medium"
                                >
                                    {month}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
