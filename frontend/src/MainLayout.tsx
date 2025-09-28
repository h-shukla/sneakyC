import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./contexts/CartProvider";

const MainLayout = () => (
    <CartProvider>
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    </CartProvider>
);

export default MainLayout;
