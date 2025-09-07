import React from "react";
import { useAuth } from "../../contexts/authContext";

const Settings: React.FC = () => {
    const { logout } = useAuth();
    return (
        <main className="flex-1 p-8 bg-white/5">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
                <h2 className="text-white text-2xl font-semibold mb-2">
                    Settings
                </h2>
                <p className="text-white/70 text-sm">
                    Manage your profile, security, notifications, and
                    preferences
                </p>
            </div>

            {/* Profile Settings */}
            <section className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
                <div className="text-yellow-400 text-lg font-bold mb-4">
                    👤 Profile Settings
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="profile-name"
                        className="text-yellow-400 font-semibold text-sm block mb-1"
                    >
                        Full Name
                    </label>
                    <input
                        id="profile-name"
                        type="text"
                        placeholder="Enter your name"
                        className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white text-base outline-none focus:border-pink-400"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="profile-email"
                        className="text-yellow-400 font-semibold text-sm block mb-1"
                    >
                        Email
                    </label>
                    <input
                        id="profile-email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white text-base outline-none focus:border-pink-400"
                    />
                </div>
                <div className="flex gap-4 mt-6">
                    <button className="rounded-xl px-4 py-2 text-yellow-400 bg-white/15 hover:bg-white/25">
                        Cancel
                    </button>
                    <button className="rounded-xl px-4 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500">
                        Save Changes
                    </button>
                </div>
            </section>

            {/* Account Security */}
            <section className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
                <div className="text-yellow-400 text-lg font-bold mb-4">
                    🔒 Account Security
                </div>
                {["current-password", "new-password", "confirm-password"].map(
                    (id) => (
                        <div key={id} className="mb-4">
                            <label
                                htmlFor={id}
                                className="text-yellow-400 font-semibold text-sm block mb-1"
                            >
                                {id === "current-password"
                                    ? "Current Password"
                                    : id === "new-password"
                                    ? "New Password"
                                    : "Confirm New Password"}
                            </label>
                            <input
                                id={id}
                                type="password"
                                placeholder={`Enter ${id.replace("-", " ")}`}
                                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white text-base outline-none focus:border-pink-400"
                            />
                        </div>
                    )
                )}
                <div className="flex gap-4 mt-6">
                    <button className="rounded-xl px-4 py-2 text-yellow-400 bg-white/15 hover:bg-white/25">
                        Cancel
                    </button>
                    <button className="rounded-xl px-4 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500">
                        Update Password
                    </button>
                </div>
            </section>

            {/* Notification Preferences */}
            <section className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
                <div className="text-yellow-400 text-lg font-bold mb-4">
                    🔔 Notification Preferences
                </div>
                {["email-notif", "sms-notif"].map((id) => (
                    <div key={id} className="mb-4">
                        <label
                            htmlFor={id}
                            className="text-yellow-400 font-semibold text-sm block mb-1"
                        >
                            {id === "email-notif"
                                ? "Email Notifications"
                                : "SMS Notifications"}
                        </label>
                        <select
                            id={id}
                            className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-gray-700 text-base outline-none"
                        >
                            <option value="all">All</option>
                            <option value="important">Only Important</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                ))}
                <div className="flex gap-4 mt-6">
                    <button className="rounded-xl px-4 py-2 text-yellow-400 bg-white/15 hover:bg-white/25">
                        Cancel
                    </button>
                    <button className="rounded-xl px-4 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500">
                        Save Preferences
                    </button>
                </div>
            </section>

            {/* Theme Preferences */}
            <section className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="text-yellow-400 text-lg font-bold mb-4">
                    🎨 Theme
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="theme-select"
                        className="text-yellow-400 font-semibold text-sm block mb-1"
                    >
                        Choose Theme
                    </label>
                    <select
                        id="theme-select"
                        className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-gray-700 text-base outline-none"
                    >
                        <option value="default">Default</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div className="flex gap-4 mt-6">
                    <button className="rounded-xl px-4 py-2 text-yellow-400 bg-white/15 hover:bg-white/25">
                        Cancel
                    </button>
                    <button className="rounded-xl px-4 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500">
                        Apply Theme
                    </button>
                </div>
            </section>

            <section>
                <div className="flex justify-start mt-8">
                    <button
                        onClick={logout}
                        className="rounded-xl px-4 py-2 text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500"
                    >
                        Logout
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Settings;
