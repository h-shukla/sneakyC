import { Route, Routes } from "react-router";
import MainLayout from "./MainLayout";
import AdminLayout from "./AdminLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/admin/Dashboard";
import Queries from "./pages/admin/Queries";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import Categories from "./pages/admin/Categories";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./contexts/AuthProvider";
import ForgetPassword from "./pages/ForgetPassword";
import Orders from "./pages/admin/Orders";
import ProductsListing from "./pages/ProductsListing";
import Products from "./pages/admin/Products";
import ProductDetails from "./pages/ProductDetails";
import { ToastContainer } from "react-toastify";
import CartPage from "./pages/CartPage";

function App() {
    return (
        <AuthProvider>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                pauseOnFocusLoss
            />
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/products" element={<ProductsListing />} />
                    <Route path="/cart" element={<CartPage />} />
                    {/* ✅ dynamic productId route */}
                    <Route
                        path="/product/:productId"
                        element={<ProductDetails />}
                    />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/admin/products" element={<Products />} />
                    <Route path="/admin/orders" element={<Orders />} />
                    <Route path="/admin/categories" element={<Categories />} />
                    <Route path="/admin/queries" element={<Queries />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/settings" element={<Settings />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgetPassword />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
