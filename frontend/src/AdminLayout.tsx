import { Outlet, useNavigate } from "react-router";
import Sidebar from "./components/Sidebar";
import { useEffect } from "react";
import { useAuth } from "./contexts/authContext";
const AdminLayout = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (!isLoggedIn() || role != "admin") {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-600 overflow-x-hidden">
            <Sidebar />
            {/* Main content area */}
            <main className="ml-72 flex-1 p-8 bg-white/5">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
