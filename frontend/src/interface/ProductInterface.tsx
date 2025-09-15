import type { Category } from "./CategoryInterface";

export interface ProductInterface {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    subCategory: Category;
    ratings: number;
    reviews: number;
    images: string[];
    imagePublicId: string[];
    stock: number;
    numberOfReviews: number;
    sold: number;
    createdAt: string;
    discount?: number;
}
