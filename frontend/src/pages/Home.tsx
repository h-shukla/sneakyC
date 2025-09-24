import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductsSale from "../components/ProductsSale";
import { useNavigate } from "react-router";
import HomeCategories from "../components/HomeCategories";
import FormalShoesBanner from "../components/FormalShoesBanner";
import FeaturesSection from "../components/FeaturesSection";
import type { ProductInterface as Product } from "../interface/ProductInterface";
import axios from "axios";
import type { Category } from "../interface/CategoryInterface";

const Home = () => {
    const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>(
        []
    );
    const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check role and redirect if admin
        const role = localStorage.getItem("role");
        if (role === "admin") {
            navigate("/admin");
        }
    }, [navigate]);

    // Fetch home products data from the backend
    useEffect(() => {
        const fetchHomeProducts = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/products/home`
                );
                const { bestSellingProducts, flashSaleProducts, categories } =
                    response.data;
                // console.log(response.data);
                setBestSellingProducts(bestSellingProducts);
                setFlashSaleProducts(flashSaleProducts);
                setCategories(categories);
            } catch (error) {
                console.error("Error fetching home products:", error);
            }
        };

        fetchHomeProducts();
    }, []);

    // Flash Sale example (withTimer: true)
    const flashSaleEndTime = new Date(
        Date.now() + 12 * 60 * 60 * 1000 + 25 * 60 * 1000 + 36 * 1000
    );

    return (
        <div>
            <Hero />
            <ProductsSale
                withTimer={true}
                timerDuration={flashSaleEndTime}
                products={flashSaleProducts}
            />
            <HomeCategories categories={categories} />
            <ProductsSale
                withTimer={false}
                products={bestSellingProducts}
            />
            <FormalShoesBanner />
            <FeaturesSection />
        </div>
    );
};

export default Home;
