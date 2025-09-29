import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
    Heart,
    ShoppingCart,
    Star,
    Minus,
    Plus,
    Share2,
    ArrowLeft,
    Check,
} from "lucide-react";
import type {
    ProductInterface as Product,
    ProductInterface,
} from "../interface/ProductInterface";
import { Link, useNavigate, useParams } from "react-router";
import { useCart } from "../contexts/cartContext";

const ProductDetails: React.FC = () => {
    const params = useParams();
    const productId = params.id || params.productId;
    const [product, setProduct] = useState<Product | null>(null);
    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const navigate = useNavigate();
    const { addToCart, cartItems, updateCartItem } = useCart();

    // Check if current product is in cart
    const isProductInCart = useMemo(() => {
        return cartItems.some((item) => item.product?._id === productId);
    }, [cartItems, productId]);

    // Get current quantity in cart
    const cartQuantity = useMemo(() => {
        const cartItem = cartItems.find(
            (item) => item.product?._id === productId
        );
        return cartItem ? cartItem.quantity : 0;
    }, [cartItems, productId]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/products/${productId}`
                );
                setProduct(response.data.product);
                setError(null);
            } catch {
                setError("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    useEffect(() => {
        const fetchSuggestedProducts = async () => {
            try {
                const productsRes = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/products`
                );

                const allProducts: Product[] = productsRes.data.products;

                if (!product?.category?._id) return;

                const filtered = allProducts.filter((p) => {
                    return (
                        p.subCategory?._id === product.subCategory!._id &&
                        p.category?._id === product.category!._id &&
                        p._id !== product._id
                    );
                });

                setSuggestedProducts(filtered.slice(0, 4));
            } catch (err) {
                console.error("Failed to load suggested products", err);
            }
        };

        if (product) {
            fetchSuggestedProducts();
        }
    }, [product]);

    const handleQuantityChange = (change: number) => {
        if (!product) return;
        setQuantity((prev) =>
            Math.max(1, Math.min(product.stock, prev + change))
        );
    };

    const handleAddToCart = async () => {
        if (!product || isAddingToCart) return;

        setIsAddingToCart(true);
        try {
            if (isProductInCart) {
                await updateCartItem(product._id, quantity);
            } else {
                await addToCart(product, quantity);
            }
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleSuggestedProductAddToCart = async (
        product: ProductInterface,
        e: React.MouseEvent
    ) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await addToCart(product, 1);
        } catch (error) {
            console.error("Failed to add suggested product to cart:", error);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < rating
                        ? "fill-yellow-200 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    const calculateDiscountedPrice = (price: number, discount?: number) => {
        if (!discount) return price;
        return price - (price * discount) / 100;
    };

    const calculateOriginalPrice = (
        currentPrice: number,
        discount?: number
    ) => {
        if (!discount) return currentPrice;
        return currentPrice / (1 - discount / 100);
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                                <div className="flex space-x-2">
                                    {Array.from({ length: 3 }, (_, i) => (
                                        <div
                                            key={i}
                                            className="w-20 h-20 bg-gray-200 rounded-lg"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-12 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="bg-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {error || "Product not found"}
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const discountedPrice = calculateDiscountedPrice(
        product.price,
        product.discount
    );
    const originalPrice = product.discount
        ? calculateOriginalPrice(product.price, product.discount)
        : null;

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/products")}
                    className="flex items-center space-x-2 text-gray-600 hover:text-black mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Products</span>
                </button>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 md:mb-16">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
                            {product.discount && (
                                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-2 py-1 rounded z-10">
                                    -{product.discount}%
                                </span>
                            )}
                            <img
                                src={
                                    product.imagePublicId[selectedImageIndex]
                                        ? `${
                                              import.meta.env.VITE_API_BASE_URL
                                          }/${product.imagePublicId[
                                              selectedImageIndex
                                          ].replace(/\\/g, "/")}`
                                        : "https://via.placeholder.com/150"
                                }
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {product.imagePublicId.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {product.imagePublicId.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedImageIndex(index)
                                        }
                                        className={`flex-shrink-0 aspect-square w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 ${
                                            selectedImageIndex === index
                                                ? "border-black"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <img
                                            src={
                                                img
                                                    ? `${
                                                          import.meta.env
                                                              .VITE_API_BASE_URL
                                                      }/${img.replace(
                                                          /\\/g,
                                                          "/"
                                                      )}`
                                                    : "https://via.placeholder.com/150"
                                            }
                                            alt={product.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            <h4 className="text-sm text-gray-600 mb-2">
                                {product.category?.name}
                                {"'s "}
                            </h4>

                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center space-x-1">
                                    {renderStars(product.ratings)}
                                    <span className="text-sm text-gray-600 ml-2">
                                        {product.ratings.toFixed(1)} (
                                        {product.numberOfReviews} reviews)
                                    </span>
                                </div>
                                {product.sold > 0 && (
                                    <span className="text-sm text-gray-500">
                                        {product.sold} sold
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center space-x-3 mb-6">
                                <span className="text-2xl md:text-3xl font-bold text-red-600">
                                    ${discountedPrice.toFixed(2)}
                                </span>
                                {originalPrice && (
                                    <>
                                        <span className="text-lg md:text-xl text-gray-400 line-through">
                                            ${originalPrice.toFixed(2)}
                                        </span>
                                        <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                                            -{product.discount}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {product.description
                                .split(";")
                                .map((item, index) => (
                                    <span key={index}>
                                        {item.trim()}
                                        <br />
                                    </span>
                                ))}

                            <div className="flex items-center space-x-2 text-sm mt-6">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        product.stock > 0
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {product.stock > 0
                                        ? `${product.stock} in stock`
                                        : "Out of stock"}
                                </span>
                                {isProductInCart && (
                                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                        {cartQuantity} in cart
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700">
                                    Quantity:
                                </span>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock}
                                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <button
                                    disabled={
                                        product.stock === 0 ||
                                        isAddingToCart ||
                                        isProductInCart
                                    }
                                    onClick={handleAddToCart}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm md:text-base transition-all ${
                                        isProductInCart
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-black hover:bg-gray-800 text-white"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isAddingToCart ? (
                                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : isProductInCart ? (
                                        <Check className="w-4 h-4 md:w-5 md:h-5" />
                                    ) : (
                                        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                    )}
                                    <span>
                                        {isAddingToCart
                                            ? "Adding..."
                                            : isProductInCart
                                            ? "In Cart"
                                            : "Add to Cart"}
                                    </span>
                                </button>

                                <div className="flex space-x-3 sm:flex-none">
                                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Heart className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>

                                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggested Products */}
                {suggestedProducts.length > 0 && (
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">
                            You might also like
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                            {suggestedProducts.map((suggestedProduct) => {
                                const suggestedDiscountedPrice =
                                    calculateDiscountedPrice(
                                        suggestedProduct.price,
                                        suggestedProduct.discount
                                    );
                                const suggestedOriginalPrice =
                                    suggestedProduct.discount
                                        ? calculateOriginalPrice(
                                              suggestedProduct.price,
                                              suggestedProduct.discount
                                          )
                                        : null;

                                const isInCart = cartItems.some(
                                    (item) =>
                                        item.product?._id ===
                                        suggestedProduct._id
                                );

                                return (
                                    <Link
                                        key={suggestedProduct._id}
                                        to={`/product/${suggestedProduct._id}`}
                                    >
                                        <div className="bg-gray-50 p-2 md:p-4 rounded shadow-sm hover:shadow-md transition cursor-pointer">
                                            <div className="relative h-32 md:h-48 flex items-center justify-center bg-white mb-2 md:mb-4 overflow-hidden rounded">
                                                {suggestedProduct.discount && (
                                                    <span className="absolute top-1 md:top-2 left-1 md:left-2 bg-red-500 text-white text-xs px-1 md:px-2 py-1 rounded">
                                                        -
                                                        {
                                                            suggestedProduct.discount
                                                        }
                                                        %
                                                    </span>
                                                )}
                                                <img
                                                    src={
                                                        suggestedProduct
                                                            .imagePublicId[0]
                                                            ? `${
                                                                  import.meta
                                                                      .env
                                                                      .VITE_API_BASE_URL
                                                              }/${suggestedProduct.imagePublicId[0].replace(
                                                                  /\\/g,
                                                                  "/"
                                                              )}`
                                                            : "https://via.placeholder.com/150"
                                                    }
                                                    alt={suggestedProduct.name}
                                                    className="h-24 md:h-32 object-contain"
                                                />
                                            </div>
                                            <h3 className="text-xs md:text-sm font-medium mb-1 line-clamp-2">
                                                {suggestedProduct.name}
                                            </h3>
                                            <div className="text-red-600 font-semibold text-sm md:text-base">
                                                $
                                                {suggestedDiscountedPrice.toFixed(
                                                    2
                                                )}
                                            </div>
                                            {suggestedOriginalPrice && (
                                                <div className="text-gray-400 line-through text-xs md:text-sm">
                                                    $
                                                    {suggestedOriginalPrice.toFixed(
                                                        2
                                                    )}
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-500 mt-1">
                                                ⭐{" "}
                                                {suggestedProduct.ratings.toFixed(
                                                    1
                                                )}{" "}
                                                (
                                                {
                                                    suggestedProduct.numberOfReviews
                                                }
                                                )
                                            </div>
                                            <button
                                                disabled={
                                                    product.stock === 0 ||
                                                    isAddingToCart ||
                                                    isProductInCart
                                                }
                                                onClick={(e) =>
                                                    handleSuggestedProductAddToCart(
                                                        suggestedProduct,
                                                        e
                                                    )
                                                }
                                                className={`mt-2 md:mt-4 w-full py-2 rounded transition text-xs md:text-sm flex items-center justify-center space-x-1 ${
                                                    isInCart
                                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                                        : "bg-black text-white hover:bg-gray-800"
                                                }`}
                                            >
                                                {isInCart ? (
                                                    <>
                                                        <Check className="w-3 h-3" />
                                                        <span>In Cart</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="w-3 h-3" />
                                                        <span>Add to Cart</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
