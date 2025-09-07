import React from "react";
import shoes from "../assets/formal-shoes.png";

const FormalShoesBanner: React.FC = () => {
    return (
        <div className="flex justify-center items-center py-8">
            <div className="bg-black text-white p-8 flex flex-col md:flex-row items-center justify-between rounded-md overflow-hidden  min-w-[80vw]">
                {/* Image */}
                <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
                    <img
                        src={shoes}
                        alt="Formal Shoes"
                        className="max-h-60 object-contain"
                    />
                </div>

                {/* Text and Button */}
                <div className="text-center md:text-left w-full md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-4">
                        Best in class <br />
                        <span className="font-bold">Formal Shoes</span>
                    </h2>
                    <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition">
                        View all Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormalShoesBanner;
