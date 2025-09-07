import React from "react";
import { Truck, Headphones, Shield } from "lucide-react";

const FeaturesSection: React.FC = () => {
    const features = [
        {
            icon: <Truck className="w-8 h-8 text-white" />,
            title: "FREE AND FAST DELIVERY",
            description: "Free delivery for all orders over $140",
        },
        {
            icon: <Headphones className="w-8 h-8 text-white" />,
            title: "24/7 CUSTOMER SERVICE",
            description: "Friendly 24/7 customer support",
        },
        {
            icon: <Shield className="w-8 h-8 text-white" />,
            title: "MONEY BACK GUARANTEE",
            description: "We return money within 30 days",
        },
    ];

    return (
        <div className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center"
                        >
                            {/* Icon Container */}
                            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-6 relative">
                                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
                                    {feature.icon}
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-black mb-2 tracking-wide">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
