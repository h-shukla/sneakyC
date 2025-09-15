import { ChevronLeft, ChevronRight, Heart, Eye } from "lucide-react";
import type { ProductInterface as Product } from "../interface/ProductInterface";
import FlashSaleTimer from "./FlashSaleTimer";

interface ProductsSaleProps {
    withTimer: boolean;
    timerDuration?: Date;
    products: Product[]; // Products passed via props
}

const ProductsSale = ({
    withTimer,
    timerDuration,
    products,
}: ProductsSaleProps) => {
    // Render stars for ratings
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`text-sm ${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
            >
                ★
            </span>
        ));
    };

    // Product Card component
    const ProductCard = ({ product }: { product: Product }) => (
        <div className="group relative rounded-lg bg-gray-50 p-4 transition-shadow hover:shadow-lg">
            <div className="absolute left-3 top-3 z-10 rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
                -20%
            </div>

            {/* Action Icons */}
            <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100">
                    <Heart className="h-4 w-4" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100">
                    <Eye className="h-4 w-4" />
                </button>
            </div>

            {/* Product Image */}
            <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white">
                <img
                    src={
                        import.meta.env.VITE_API_BASE_URL +
                        "/" +
                        product.imagePublicId[0]
                    } // Assuming the first image is the primary one
                    alt={product.name}
                    className="h-32 w-32 object-cover"
                />
            </div>

            {/* Product Info */}
            <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-red-500">
                        ${product.price}
                    </span>
                    <span className="text-gray-400 line-through">
                        ${(product.price * 1.2).toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {renderStars(product.ratings)}
                    <span className="ml-1 text-sm text-gray-500">
                        ({product.reviews})
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="mx-auto max-w-6xl bg-white p-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="group flex items-center gap-2 rounded transition-colors hover:bg-yellow-400 pr-20">
                        <div className="h-8 w-1 rounded bg-yellow-400 transition-colors"></div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {withTimer ? "Flash Sale" : "Best Selling"}
                        </h2>
                    </div>
                </div>

                {/* Timer for Flash Sale */}
                {withTimer && timerDuration && (
                    <FlashSaleTimer timerDuration={timerDuration} />
                )}

                {/* View All Button for Best Selling */}
                {!withTimer && (
                    <button className="rounded bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800">
                        View All
                    </button>
                )}
            </div>

            {/* Products Grid with Navigation */}
            <div className="relative">
                {/* Left Arrow */}
                <button className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-6 px-8 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                {/* Right Arrow */}
                <button className="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 translate-x-4 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* View All Products Button for Flash Sale */}
            {withTimer && (
                <div className="mt-8 flex justify-center">
                    <button className="rounded bg-black px-8 py-3 text-white transition-colors hover:bg-gray-800">
                        View all Products
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductsSale;
