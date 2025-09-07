export interface ProductInterface {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    ratings: number;
    reviews: number;
    image: string[];
    imagePublicId: string[];
    stock: number;
    numberOfReviews: number;
    sold: number;
    createdAt: string;
    discount?: number;
}
